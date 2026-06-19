import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class ClioApi implements ICredentialType {
  name = 'clioApi';
  displayName = 'Clio API Key';
  documentationUrl = 'https://app.clio.com/api/v4/documentation#section/Authorization';
  icon = 'file:clio.svg' as const;

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      hint: 'Generate an API key in Clio under Settings → API Keys',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };
}
