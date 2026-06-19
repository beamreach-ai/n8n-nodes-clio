import {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  IHttpRequestMethods,
  IRequestOptions,
  JsonObject,
  NodeApiError,
} from 'n8n-workflow';

const CLIO_API_BASE = 'https://app.clio.com/api/v4';

export async function clioApiRequest(
  this: IExecuteFunctions | IHookFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
): Promise<JsonObject> {
  const authentication = this.getNodeParameter('authentication', 0, 'oAuth2') as string;

  const options: IRequestOptions = {
    method,
    qs,
    url: `${CLIO_API_BASE}${endpoint}`,
    json: true,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (Object.keys(body).length > 0) {
    options.body = body;
  }

  try {
    if (authentication === 'oAuth2') {
      return (await this.helpers.requestOAuth2.call(
        this,
        'clioOAuth2Api',
        options,
      )) as JsonObject;
    }
    return (await this.helpers.requestWithAuthentication.call(
      this,
      'clioApi',
      options,
    )) as JsonObject;
  } catch (error) {
    throw new NodeApiError(this.getNode(), error as JsonObject);
  }
}

export async function clioApiRequestAllItems(
  this: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
): Promise<JsonObject[]> {
  const results: JsonObject[] = [];
  let page = 1;

  while (true) {
    const response = (await clioApiRequest.call(this, method, endpoint, body, {
      ...qs,
      limit: 200,
      page,
    })) as { data: JsonObject[]; meta?: { paging?: { next: string | null } } };

    if (Array.isArray(response.data)) {
      results.push(...response.data);
    }

    if (!response.meta?.paging?.next || response.data?.length < 200) break;
    if (page >= 50) break; // safety ceiling: 10 000 records

    page++;
  }

  return results;
}
