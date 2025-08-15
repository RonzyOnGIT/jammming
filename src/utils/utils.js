import { v4 as uuidv4 } from 'uuid';

const clientId = import.meta.env.VITE_CLIENT_ID;
const responseType = 'token';
const redirectUri = 'http://localhost:5173/';
// random generated string to correlate user session with responses to prevent against attacks
const scope = 'playlist-modify-public user-read-private';
let baseUrl = 'https://api.spotify.com/v1/';

// returns object containing when expires and token value
export const handleRedirectFromSpotify = () => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const returnState = params.get('state');

    if (localStorage.getItem('spotifyAuthState') == returnState && params.has('access_token')) {
        const returnedParams = {
            token: params.get('access_token'),
            expiresIn: params.get('expires_in')
        }
        // clear url
        window.history.pushState('AccessToken', null, '/'); 
        return returnedParams;
    } else {
        if (localStorage.getItem('spotifyAuthState') != returnState) {
            console.log('State Values do not match');
            return null;
        }
        const errorHash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const errorReason = params.get('error');
        console.log(errorReason);
    }
}

export const logout = async (id) => {

    try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`, {method: "DELETE"});

        if (response.ok) {
            return true; // succesfully deleted user and logged out
        } else {
            console.error(response.status);
            return false;
        }

    } catch (error) {
        console.error(error);
    }
}


export const redirectToSpotifyAuth = () => {
    const state = uuidv4();
    let authUrl = `https://accounts.spotify.com/authorize?response_type=${responseType}&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;
    localStorage.setItem('spotifyAuthState', state);
    window.location.href = authUrl;
}

export const addSongsToPlaylist = async (id, accessToken, uriSongs) => {
    const endPoint = baseUrl + 'playlists/' + id + '/tracks';
    
    const requestBody = {
        uris: uriSongs
    };

    const postOptions = {
        method: 'POST',
        headers: {'Authorization': 'Bearer ' + accessToken},
        body: JSON.stringify(requestBody)
    };

    const results = await fetch(endPoint, postOptions);
    const data = await results.json();
    console.log(data);

}


export const createNewPlaylist = async (playlistName, playlistSongs, userId) => {
    // const userId = await getUsersProfileId(accessToken);

    const playlistSongsArray = Array.from(playlistSongs.values());
    const songsUri = playlistSongsArray.map(song => song.uri);

    const playlistObjectBody = {
        uris: songsUri,
        userId: userId,
        name: playlistName,
        description: "playlist",
        public: true
    };

    const postOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playlistObjectBody)
    };


    try {
        // const response = await fetch(endPoint, postOptions);
        const endpoint = 'http://localhost:8080/api/query/playlist';
        const response = await fetch(endpoint, postOptions);

        if (!response.ok) {
            throw new Error(`error: ${response.status}`);
        }

        return true // success so return true
    } catch (err) {
        console.log(err);
        return false;
    }    

}


// make fetch request for songs to spring boot backend api endpoint and the backend will look up user with id and make request to spotify with token with the user with that id
export const fetchSongs = async (songName, id) => {
    let endpoint = `http://localhost:8080/api/query/songs?id=${id}&songName=${songName}`;

    try {
        const response = await fetch(endpoint);
        if (response.ok) {
            const data = await response.json();
            return data; // array of songs
        }
    } catch (error) {
        console.error(error);
    }

}

// returns an object containing with { succes: boolean, userId: userId } where the userId will be used to query backend's database
export const exchangeToken = async (code) => {
    const endPoint = 'http://localhost:8080/api/exchange';


    const requestBody = {
        code: code
    };

    const postOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    };

    try {
        const res = await fetch(endPoint, postOptions);
        const data = await res.json();

        if (data.success) {

            return {
                'success': true,
                'userId': data.userId,
                'expireTime': data.expireTime
            };

        } else {
            return {
                'success': false,
                'userId': null,
                'expireTime': null
            }
        }
    } catch (error) {
        console.error("Error exchanging token: ", error);
    }

}

