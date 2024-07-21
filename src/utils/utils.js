import { v4 as uuidv4 } from 'uuid';

const clientId = import.meta.env.VITE_CLIENT_ID;
const responseType = 'token';
const redirectUri = 'http://localhost:5173/';
// random generated string to correlate user session with responses to prevent against attacks
const scope = 'playlist-modify-public playlist-modify-private';
let baseSearchUrl = 'https://api.spotify.com/v1/search';

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

export const fetchSongs = async (songName, accessToken) => {

    const endPoint = `${baseSearchUrl}?q=${songName}&type=track&limit=6`;

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
    const tracks = jsonResponse.tracks.items
    // console.log(tracks);
    return tracks;

}



















// const handleSuccess = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const authCode = urlParams.get('access_token');
//     const state = urlParams.get('state');
//     const expiration = urlParams.get('expires_in');
//     console.log(urlParams);
// }

// const handleError = () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const error = urlParams.get('error');
//     const state = urlParams.get('state');
//     console.log(urlParams);
// }

// const utilFunctions = {

// };

