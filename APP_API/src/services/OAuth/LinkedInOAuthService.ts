// src/services/LinkedInOAuthService.ts
import axios from 'axios';

export class LinkedInOAuthService {
  private clientId     = process.env.LINKEDIN_CLIENT_ID!;
  private clientSecret = process.env.LINKEDIN_CLIENT_SECRET!;
  private redirectUri  = process.env.LINKEDIN_REDIRECT_URI!;

  /**
   * 1) build the URL to send your admin user to LinkedIn
   */
  public getAuthorizationUrl(state: string) {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id:     this.clientId,
      redirect_uri:  this.redirectUri,
      scope:         'r_liteprofile w_member_social r_organization_social w_organization_social r_analytics', 
      state,
    });
    return `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  }

  /**
   * 2) exchange the authorization code for tokens
   */
  public async exchangeCodeForToken(code: string) {
    const params = new URLSearchParams({
      grant_type:    'authorization_code',
      code,
      redirect_uri:  this.redirectUri,
      client_id:     this.clientId,
      client_secret: this.clientSecret,
    });

    const { data } = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      params.toString(),
      { headers: {'Content-Type': 'application/x-www-form-urlencoded'} }
    );

    // data = { access_token: string, expires_in: number }
    return {
      accessToken:  data.access_token,
      expiresInSec: data.expires_in,
      // LinkedIn does not currently return a refresh_token here;
      // but if they ever do, you can pull it out
    };
  }

  /**
   * 3) retrieve the LinkedIn user’s “URN” (person ID)
   */
  public async fetchLinkedInId(accessToken: string) {
    const { data } = await axios.get(
      'https://api.linkedin.com/v2/me',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    // data.id is like “urn:li:person:XXXXXXXX”
    return data.id as string;
  }


}
