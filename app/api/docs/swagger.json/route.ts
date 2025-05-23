import { NextResponse } from "next/server"

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "BoxRec API Proxy",
    version: "1.0.0",
    description: "A proxy API for accessing BoxRec.com data programmatically",
    contact: {
      name: "API Support",
      url: "https://github.com/ygoriachiy1982/boxrec_api_25052025",
    },
  },
  servers: [
    {
      url: "/api",
      description: "Production server",
    },
  ],
  components: {
    schemas: {
      AuthRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: {
            type: "string",
            description: "BoxRec username",
          },
          password: {
            type: "string",
            description: "BoxRec password",
          },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
          },
          message: {
            type: "string",
          },
        },
      },
      BoxerProfile: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          nickname: {
            type: "string",
          },
          record: {
            type: "object",
            properties: {
              wins: { type: "integer" },
              losses: { type: "integer" },
              draws: { type: "integer" },
            },
          },
          kos: {
            type: "integer",
          },
          personal_info: {
            type: "object",
            additionalProperties: { type: "string" },
          },
          bouts: {
            type: "array",
            items: { type: "object" },
          },
        },
      },
      SearchResult: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          record: { type: "string" },
          last_fight: { type: "string" },
        },
      },
      RatingsResponse: {
        type: "object",
        properties: {
          division: { type: "string" },
          ratings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                rank: { type: "integer" },
                id: { type: "string" },
                name: { type: "string" },
                points: { type: "number" },
                record: { type: "string" },
              },
            },
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
          },
        },
      },
    },
    securitySchemes: {
      CookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "PHPSESSID",
      },
    },
  },
  paths: {
    "/auth": {
      post: {
        summary: "Authenticate with BoxRec",
        description: "Authenticate using BoxRec credentials to access protected endpoints",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Authentication successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Authentication failed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/boxer/{id}": {
      get: {
        summary: "Get boxer profile",
        description: "Retrieve detailed information about a boxer by their BoxRec ID",
        security: [{ CookieAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "BoxRec boxer ID",
          },
        ],
        responses: {
          "200": {
            description: "Boxer profile data",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BoxerProfile" },
              },
            },
          },
          "401": {
            description: "Not authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Boxer not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/search": {
      get: {
        summary: "Search boxers",
        description: "Search for boxers by name",
        security: [{ CookieAuth: [] }],
        parameters: [
          {
            name: "query",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Search query (boxer name)",
          },
        ],
        responses: {
          "200": {
            description: "Search results",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/SearchResult" },
                },
              },
            },
          },
          "400": {
            description: "Missing search query",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Not authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/ratings/{division}": {
      get: {
        summary: "Get division ratings",
        description: "Retrieve ratings for a specific weight division",
        security: [{ CookieAuth: [] }],
        parameters: [
          {
            name: "division",
            in: "path",
            required: true,
            schema: {
              type: "string",
              enum: [
                "heavyweight",
                "cruiserweight",
                "lightheavyweight",
                "supermiddleweight",
                "middleweight",
                "superwelterweight",
                "welterweight",
                "superLightweight",
                "lightweight",
                "superfeatherweight",
                "featherweight",
                "superbantamweight",
                "bantamweight",
                "superflyweight",
                "flyweight",
                "lightflyweight",
                "minimumweight",
              ],
            },
            description: "Weight division name",
          },
        ],
        responses: {
          "200": {
            description: "Division ratings",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RatingsResponse" },
              },
            },
          },
          "400": {
            description: "Invalid division",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Not authenticated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
}

export async function GET() {
  return NextResponse.json(swaggerDocument)
}
