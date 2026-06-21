import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ClioOAuth2Api implements ICredentialType {
  name = 'clioOAuth2Api';
  extends = ['oAuth2Api'];
  displayName = 'Clio OAuth2';
  documentationUrl = 'https://app.clio.com/api/v4/documentation#section/Authorization';
  icon = 'file:clio.svg' as const;

  properties: INodeProperties[] = [
    {
      displayName: 'Region',
      name: 'region',
      type: 'options',
      options: [
        { name: 'North America (app.clio.com)', value: 'us' },
        { name: 'Europe (eu.app.clio.com)', value: 'eu' },
      ],
      default: 'us',
    },
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default: '=https://{{ $self["region"] === "eu" ? "eu." : "" }}app.clio.com/oauth/authorize',
      required: true,
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default: '=https://{{ $self["region"] === "eu" ? "eu." : "" }}app.clio.com/oauth/token',
      required: true,
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'hidden',
      default: '',
    },
    {
      displayName: 'Auth URI Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: '',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'header',
    },
  ];
}
