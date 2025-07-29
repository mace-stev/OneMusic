import bcrypt from "bcryptjs";
import {OAuthParams} from "../types/youtube"


export function createOAuthForm(oauthParams: OAuthParams): HTMLFormElement {
  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = oauth2Endpoint;
  Object.entries(oauthParams).forEach(([key, val]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = val || '';
    form.appendChild(input);
  });
  return form;
}

export function oauth2SignIn(form: HTMLFormElement) {
  document.body.appendChild(form);
  form.submit();
}
export async function verifyState(stateToCheck: string): Promise<boolean> {
    const storedState = sessionStorage.getItem('oauth2-state');
    if (!storedState) return false;


    return bcrypt.compare(stateToCheck, storedState);
  }