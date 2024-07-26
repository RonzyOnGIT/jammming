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


export const redirectToSpotifyAuth = () => {
    const state = uuidv4();
    let authUrl = `https://accounts.spotify.com/authorize?response_type=${responseType}&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;
    localStorage.setItem('spotifyAuthState', state);
    window.location.href = authUrl;
}

export const getUsersProfileId = async (accessToken) => {
    const endpoint = baseUrl + 'me';

    const fetchOptions = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + accessToken}
    };

    try {
        const response = await fetch(endpoint, fetchOptions);

        if (!response.ok) {
            throw new Error(`error status: ${response.status}`)
        }

        const data = await response.json();
        return data.id;

    } catch (err) {
        console.log(err);
        return null;
    }


}

export const createNewPlaylist = async (playlistName, accessToken) => {
    const userId = await getUsersProfileId(accessToken);

    console.log(`creating playlist ${playlistName} for user id: ${userId}...`);
    const endPoint = baseUrl + 'users/' + userId + '/playlists';

    const playlistObject = {
        name: playlistName,
        description: 'post test',
        public: true
    };

    const postOptions = {
        method: 'POST',
        headers: {'Authorization': 'Bearer ' + accessToken},
        body: JSON.stringify(playlistObject)
    }

    try {
        const response = await fetch(endPoint, postOptions);

        if (!response.ok) {
            throw new Error(`error: ${response.status}`)
        }

        const data = await response.json();
        console.log('playlist created');
    } catch (err) {
        console.log(err);
    }    

}

export const fetchSongs = async (songName, accessToken) => {

    const endPoint = `${baseUrl}search?q=${songName}&type=track&limit=6`;

    const fetchOptions = {
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + accessToken}
    };

    const res = await fetch(endPoint, fetchOptions);

    if (!res.ok) {
        console.log('request failed');
        return;
    }

    const jsonResponse = await res.json();
    const tracks = jsonResponse.tracks.items;
    // console.log(tracks);
    return tracks;
}


