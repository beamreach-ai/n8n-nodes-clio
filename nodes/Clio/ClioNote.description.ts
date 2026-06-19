import { INodeProperties } from 'n8n-workflow';

export const noteOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['note'] } },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Add a note to a matter',
        action: 'Create a note',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Retrieve a note by ID',
        action: 'Get a note',
      },
      {
        name: 'Get Many',
        value: 'getAll',
        description: 'Retrieve notes for a matter',
        action: 'Get many notes',
      },
    ],
    default: 'create',
  },
];

export const noteFields: INodeProperties[] = [
  // ─── Create ────────────────────────────────────────────────────────────────
  {
    displayName: 'Matter ID',
    name: 'matterId',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['note'], operation: ['create'] } },
    default: '',
    description: 'ID of the Clio matter this note belongs to',
  },
  {
    displayName: 'Subject',
    name: 'subject',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['note'], operation: ['create'] } },
    default: '',
    description: 'Note subject / title',
  },
  {
    displayName: 'Detail',
    name: 'detail',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['note'], operation: ['create'] } },
    typeOptions: { rows: 6 },
    default: '',
    description: 'Note body — supports plain text',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: { show: { resource: ['note'], operation: ['create'] } },
    default: {},
    options: [
      {
        displayName: 'Date',
        name: 'date',
        type: 'dateTime',
        default: '',
        description: 'Date of the note (defaults to today)',
      },
    ],
  },

  // ─── Get ───────────────────────────────────────────────────────────────────
  {
    displayName: 'Note ID',
    name: 'noteId',
    type: 'string',
    required: true,
    displayOptions: { show: { resource: ['note'], operation: ['get'] } },
    default: '',
  },

  // ─── Get Many ──────────────────────────────────────────────────────────────
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: { show: { resource: ['note'], operation: ['getAll'] } },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: { resource: ['note'], operation: ['getAll'], returnAll: [false] },
    },
    typeOptions: { minValue: 1 },
    default: 50,
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: { show: { resource: ['note'], operation: ['getAll'] } },
    default: {},
    options: [
      {
        displayName: 'Matter ID',
        name: 'matterId',
        type: 'string',
        default: '',
        description: 'Filter notes by matter',
      },
    ],
  },
];
