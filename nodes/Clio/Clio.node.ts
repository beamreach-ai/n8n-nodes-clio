import {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  JsonObject,
  NodeOperationError,
} from 'n8n-workflow';

import { clioApiRequest, clioApiRequestAllItems } from './GenericFunctions';
import { contactFields, contactOperations } from './ClioContact.description';
import { matterFields, matterOperations } from './ClioMatter.description';
import { noteFields, noteOperations } from './ClioNote.description';

export class Clio implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Clio',
    name: 'clio',
    icon: 'file:clio.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Manage contacts, matters, and notes in Clio legal practice management',
    defaults: { name: 'Clio' },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'clioOAuth2Api',
        required: true,
        displayOptions: { show: { authentication: ['oAuth2'] } },
      },
      {
        name: 'clioApi',
        required: true,
        displayOptions: { show: { authentication: ['apiKey'] } },
      },
    ],
    properties: [
      {
        displayName: 'Authentication',
        name: 'authentication',
        type: 'options',
        options: [
          { name: 'OAuth2 (Recommended)', value: 'oAuth2' },
          { name: 'API Key', value: 'apiKey' },
        ],
        default: 'oAuth2',
        description:
          'OAuth2 is preferred for production. API Key works for quick testing.',
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Contact', value: 'contact' },
          { name: 'Matter', value: 'matter' },
          { name: 'Note', value: 'note' },
        ],
        default: 'contact',
      },
      ...contactOperations,
      ...contactFields,
      ...matterOperations,
      ...matterFields,
      ...noteOperations,
      ...noteFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: JsonObject | JsonObject[];

        // ── Contact ────────────────────────────────────────────────────────
        if (resource === 'contact') {
          if (operation === 'create') {
            const name = this.getNodeParameter('name', i) as string;
            const type = this.getNodeParameter('type', i) as string;
            const extra = this.getNodeParameter('additionalFields', i, {}) as Record<
              string,
              string
            >;

            // Clio API: Person contacts use first_name/last_name; Company contacts use name
            const body: IDataObject = { type };
            if (type === 'Person') {
              if (extra.firstName) body.first_name = extra.firstName;
              if (extra.lastName) body.last_name = extra.lastName;
              if (!extra.firstName && !extra.lastName) body.name = name;
            } else {
              body.name = name;
            }
            if (extra.email) {
              body.primary_email_address = { name: 'Work', address: extra.email };
            }
            if (extra.phone) {
              body.phone_numbers = [
                { name: 'Mobile', number: extra.phone, default_number: true },
              ];
            }
            if (extra.prefix) body.prefix = extra.prefix;
            if (extra.dateOfBirth) body.date_of_birth = extra.dateOfBirth;

            const res = (await clioApiRequest.call(this, 'POST', '/contacts.json', {
              data: body,
            })) as { data: JsonObject };
            responseData = res.data;
          } else if (operation === 'get') {
            const contactId = this.getNodeParameter('contactId', i) as string;
            const res = (await clioApiRequest.call(
              this,
              'GET',
              `/contacts/${contactId}.json`,
            )) as { data: JsonObject };
            responseData = res.data;
          } else if (operation === 'getAll') {
            const filters = this.getNodeParameter('filters', i, {}) as Record<
              string,
              string
            >;
            const qs: IDataObject = {
              fields: filters.fields || 'id,name,type,primary_email_address,phone_numbers,created_at',
            };
            if (filters.query) qs.query = filters.query;
            if (filters.type) qs.type = filters.type;

            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            if (returnAll) {
              responseData = await clioApiRequestAllItems.call(
                this,
                'GET',
                '/contacts.json',
                {},
                qs,
              );
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              const res = (await clioApiRequest.call(this, 'GET', '/contacts.json', {}, {
                ...qs,
                limit,
              })) as { data: JsonObject[] };
              responseData = res.data;
            }
          } else if (operation === 'update') {
            const contactId = this.getNodeParameter('contactId', i) as string;
            const fields = this.getNodeParameter('updateFields', i, {}) as Record<
              string,
              string
            >;
            const body: IDataObject = {};
            if (fields.name) body.name = fields.name;
            if (fields.email) body.primary_email_address = { name: 'Work', address: fields.email };
            if (fields.phone) {
              body.phone_numbers = [{ name: 'Mobile', number: fields.phone, default_number: true }];
            }
            if (fields.firstName) body.first_name = fields.firstName;
            if (fields.lastName) body.last_name = fields.lastName;

            const res = (await clioApiRequest.call(
              this,
              'PATCH',
              `/contacts/${contactId}.json`,
              { data: body },
            )) as { data: JsonObject };
            responseData = res.data;
          } else {
            throw new NodeOperationError(this.getNode(), `Unknown contact operation: ${operation}`);
          }
        }

        // ── Matter ─────────────────────────────────────────────────────────
        else if (resource === 'matter') {
          if (operation === 'create') {
            const description = this.getNodeParameter('description', i) as string;
            const clientId = this.getNodeParameter('clientId', i) as string;
            const extra = this.getNodeParameter('additionalFields', i, {}) as Record<
              string,
              string
            >;

            const body: IDataObject = {
              description,
              client: { id: Number(clientId) },
            };
            if (extra.practiceAreaId) body.practice_area = { id: Number(extra.practiceAreaId) };
            if (extra.status) body.status = extra.status;
            if (extra.openDate) body.open_date = extra.openDate;
            if (extra.responsibleAttorneyId) {
              body.responsible_attorney = { id: Number(extra.responsibleAttorneyId) };
            }
            if (extra.clientReference) body.client_reference = extra.clientReference;

            const res = (await clioApiRequest.call(this, 'POST', '/matters.json', {
              data: body,
            })) as { data: JsonObject };
            responseData = res.data;
          } else if (operation === 'get') {
            const matterId = this.getNodeParameter('matterId', i) as string;
            const res = (await clioApiRequest.call(
              this,
              'GET',
              `/matters/${matterId}.json`,
            )) as { data: JsonObject };
            responseData = res.data;
          } else if (operation === 'getAll') {
            const filters = this.getNodeParameter('filters', i, {}) as Record<
              string,
              string
            >;
            const qs: IDataObject = {
              fields:
                filters.fields ||
                'id,description,display_number,status,client,practice_area,open_date,created_at',
            };
            if (filters.clientId) qs.client_id = filters.clientId;
            if (filters.status) qs.status = filters.status;

            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            if (returnAll) {
              responseData = await clioApiRequestAllItems.call(
                this,
                'GET',
                '/matters.json',
                {},
                qs,
              );
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              const res = (await clioApiRequest.call(this, 'GET', '/matters.json', {}, {
                ...qs,
                limit,
              })) as { data: JsonObject[] };
              responseData = res.data;
            }
          } else if (operation === 'update') {
            const matterId = this.getNodeParameter('matterId', i) as string;
            const fields = this.getNodeParameter('updateFields', i, {}) as Record<
              string,
              string
            >;
            const body: IDataObject = {};
            if (fields.description) body.description = fields.description;
            if (fields.status) body.status = fields.status;
            if (fields.closeDate) body.close_date = fields.closeDate;

            const res = (await clioApiRequest.call(
              this,
              'PATCH',
              `/matters/${matterId}.json`,
              { data: body },
            )) as { data: JsonObject };
            responseData = res.data;
          } else {
            throw new NodeOperationError(this.getNode(), `Unknown matter operation: ${operation}`);
          }
        }

        // ── Note ───────────────────────────────────────────────────────────
        else if (resource === 'note') {
          if (operation === 'create') {
            const matterId = this.getNodeParameter('matterId', i) as string;
            const subject = this.getNodeParameter('subject', i) as string;
            const detail = this.getNodeParameter('detail', i) as string;
            const extra = this.getNodeParameter('additionalFields', i, {}) as Record<
              string,
              string
            >;

            const body: IDataObject = {
              subject,
              detail,
              type: 'Matter',
              matter: { id: Number(matterId) },
            };
            if (extra.date) body.date = extra.date;

            const res = (await clioApiRequest.call(this, 'POST', '/notes.json', {
              data: body,
            })) as { data: JsonObject };
            responseData = res.data;
          } else if (operation === 'get') {
            const noteId = this.getNodeParameter('noteId', i) as string;
            const res = (await clioApiRequest.call(
              this,
              'GET',
              `/notes/${noteId}.json`,
            )) as { data: JsonObject };
            responseData = res.data;
          } else if (operation === 'getAll') {
            const filters = this.getNodeParameter('filters', i, {}) as Record<
              string,
              string
            >;
            const qs: IDataObject = {
              fields: 'id,subject,detail,matter,date,created_at',
            };
            if (filters.matterId) qs.matter_id = filters.matterId;

            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            if (returnAll) {
              responseData = await clioApiRequestAllItems.call(
                this,
                'GET',
                '/notes.json',
                {},
                qs,
              );
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              const res = (await clioApiRequest.call(this, 'GET', '/notes.json', {}, {
                ...qs,
                limit,
              })) as { data: JsonObject[] };
              responseData = res.data;
            }
          } else {
            throw new NodeOperationError(this.getNode(), `Unknown note operation: ${operation}`);
          }
        } else {
          throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(
            Array.isArray(responseData) ? responseData : [responseData],
          ),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          const executionErrorData = this.helpers.constructExecutionMetaData(
            [{ json: { error: (error as Error).message } }],
            { itemData: { item: i } },
          );
          returnData.push(...executionErrorData);
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
