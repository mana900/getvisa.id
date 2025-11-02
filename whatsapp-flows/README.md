# WhatsApp Flow Configuration for Visa Applications

This directory contains WhatsApp Flow JSON configurations for collecting visa application information from users via WhatsApp/Facebook Messenger.

## Available Flows

### 1. Basic Visa Application Flow
**File:** `visa-application-flow.json`

Simple text-based form that collects:
- Name (required)
- Destination country (free text input)
- Number of travelers (required)
- Email (optional)

**Use this when:** You want users to type in their destination country freely.

### 2. Visa Application Flow with Dropdown
**File:** `visa-application-flow-with-dropdown.json`

Enhanced form with dropdown selection that collects:
- Name (required)
- Destination country (dropdown with 20+ pre-populated countries)
- Number of travelers (required)
- Email (optional)
- Phone number (optional)

**Use this when:** You want to provide a curated list of countries and reduce user input errors.

## How to Use

### 1. Upload Flow to WhatsApp Business Manager

1. Go to [WhatsApp Business Manager](https://business.facebook.com/wa/manage/flows/)
2. Click "Create Flow"
3. Choose "Upload JSON"
4. Upload one of the JSON files from this directory
5. Test the flow in the preview
6. Publish the flow

### 2. Integrate with WhatsApp Business API

```bash
# Example curl command to send a flow message
curl -X POST 'https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
-H 'Content-Type: application/json' \
-d '{
  "messaging_product": "whatsapp",
  "to": "CUSTOMER_PHONE_NUMBER",
  "type": "interactive",
  "interactive": {
    "type": "flow",
    "header": {
      "type": "text",
      "text": "Apply for Your Visa"
    },
    "body": {
      "text": "Get your visa processed quickly and easily. Click below to start your application."
    },
    "footer": {
      "text": "GetVisa.ID by Travion"
    },
    "action": {
      "name": "flow",
      "parameters": {
        "flow_message_version": "3",
        "flow_token": "FLOW_TOKEN",
        "flow_id": "YOUR_FLOW_ID",
        "flow_cta": "Start Application",
        "flow_action": "navigate",
        "flow_action_payload": {
          "screen": "VISA_APPLICATION_FORM"
        }
      }
    }
  }
}'
```

### 3. Handle Flow Responses

When a user submits the form, you'll receive a webhook with the data:

```json
{
  "name": "John Doe",
  "destination": "south-korea",
  "travelers": "2",
  "email": "john@example.com",
  "phone": "+628123456789"
}
```

## Flow Structure

### Screens
1. **VISA_APPLICATION_FORM**: Main form where users input their information
2. **SUCCESS_SCREEN**: Confirmation screen shown after successful submission

### Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | Text | Yes | Full name of the applicant |
| destination | Text/Dropdown | Yes | Country they want to visit |
| travelers | Number | Yes | Number of people applying |
| email | Email | No | Contact email address |
| phone | Phone | No | Contact phone number |

## Customization

### Adding More Countries to Dropdown

Edit the `data.countries` array in `visa-application-flow-with-dropdown.json`:

```json
{
  "id": "country-code",
  "title": "Country Name 🇫🇱"
}
```

### Changing Required Fields

Set `"required": false` for any field you want to make optional.

### Adding Custom Fields

Add new form fields in the `children` array:

```json
{
  "type": "TextInput",
  "name": "field_name",
  "label": "Field Label",
  "required": true,
  "input-type": "text"
}
```

Available input types:
- `text` - Single line text
- `number` - Numeric input
- `email` - Email address
- `phone` - Phone number
- `password` - Password field

## Integration with GetVisa.ID

These flows are designed to integrate with the GetVisa.ID platform:

1. User fills out the WhatsApp Flow
2. Data is sent to your webhook endpoint
3. Create a contact lead in your database using the `/api/admin/contact-leads` endpoint
4. Follow up with the user via WhatsApp with visa options from your database
5. Send them a link to complete the application on your website

## Testing

1. Use WhatsApp Flow Simulator in Business Manager
2. Test with your phone number in development mode
3. Verify data is correctly captured in the payload
4. Test the webhook integration

## Notes

- WhatsApp Flows are currently in limited availability
- Ensure your WhatsApp Business Account is verified
- Maximum flow size: 10 screens
- Maximum form fields: 50 per screen
- Flows must comply with WhatsApp Commerce Policy

## Support

For questions or issues:
- WhatsApp API Documentation: https://developers.facebook.com/docs/whatsapp/flows
- GetVisa.ID Support: Contact your development team
