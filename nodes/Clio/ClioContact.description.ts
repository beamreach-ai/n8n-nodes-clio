import { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['contact'] } },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new contact',
        action: 'Create a contact',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Retrieve a contact by ID',
        action: 'Get a contact',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Retrieve a list of contacts',
        action: 'Get many contacts',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an existing contact',
        action: 'Update a contact',
      },
    ],
    default: 'create',
  },
];

export const contactFields: INodeProperties[] = [
  // ─── Create ────────────────────────────────────────────────────────────────
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
    default: '',
    description: 'Full name of the contact (person or company)',
  },
  {
    displayName: 'Type',
    name: 'type',
    type: 'options',
    required: true,
    displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
    options: [
      { name: 'Person', value: 'Person' },
      { name: 'Company', value: 'Company' },
    ],
    default: 'Person',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: { show: { resource: ['contact'], operation: ['create'] } },
    default: {},
    options: [
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        placeholder: 'name@example.com',
        typeOptions: { email: true },
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        placeholder: '+1 555 000 0000',
      },
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Prefix',
        name: 'prefix',
        type: 'string',
        default: '',
        description: 'E.g. Mr., Ms., Dr.',
      },
      {
        displayName: 'Date of Birth',
        name: 'dateOfBirth',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'Country of Origin',
        name: 'country',
        type: 'string',
        default: '',
        description: 'Used as a custom field note — not a native Clio field',
      },
    ],
  },

  // ─── Get / Update ID ───────────────────────────────────────────────────────
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['contact'], operation: ['get', 'update'] } },
    default: '',
    description: 'Numeric Clio contact ID',
  },

  // ─── Get Many ──────────────────────────────────────────────────────────────
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: { resource: ['contact'], operation: ['getAll'] } },
    default: false,
    description: 'Whether to return all results or only up to the specified limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: { resource: ['contact'], operation: ['getAll'], returnAll: [false] },
    },
    typeOptions: { minValue: 1, maxValue: 200 },
    default: 50,
    description: 'Max number of contacts to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: { show: { resource: ['contact'], operation: ['getAll'] } },
    default: {},
    options: [
      {
        displayName: 'Search Query',
        name: 'query',
        type: 'string',
        default: '',
        description: 'Search by name or email address',
      },
      {
        displayName: 'Type',
        name: 'type',
        type: 'options',
        default: '',
        options: [
          { name: 'All', value: '' },
          { name: 'Person', value: 'Person' },
          { name: 'Company', value: 'Company' },
        ],
      },
      {
        displayName: 'Fields',
        name: 'fields',
        type: 'string',
        default: 'id,name,type,primary_email_address,phone_numbers,created_at',
        description: 'Comma-separated list of Clio fields to include in the response',
      },
    ],
  },

  // ─── Update ────────────────────────────────────────────────────────────────
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: { show: { resource: ['contact'], operation: ['update'] } },
    default: {},
    options: [
      { displayName: 'Name', name: 'name', type: 'string', default: '' },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        placeholder: 'name@example.com',
        typeOptions: { email: true },
      },
      { displayName: 'Phone', name: 'phone', type: 'string', default: '' },
      { displayName: 'First Name', name: 'firstName', type: 'string', default: '' },
      { displayName: 'Last Name', name: 'lastName', type: 'string', default: '' },
    ],
  },
];
