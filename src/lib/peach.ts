import crypto from 'crypto';

export interface PeachCheckoutParams {
  amount: string;
  currency: string;
  merchantTransactionId: string;
  nonce: string;
  shopperResultUrl: string;
  paymentType: 'DB' | 'PA';
  createRegistration?: 'true' | 'false';
  'customer.email'?: string;
  'customer.givenName'?: string;
  'customer.surname'?: string;
  notificationUrl?: string;
  cancelUrl?: string;
  'authentication.entityId': string;
}

export const generatePeachSignature = (params: Record<string, any>, secretToken: string): string => {
  // 1. Sort parameters alphabetically by key
  const sortedKeys = Object.keys(params).sort();
  
  // 2. Concatenate parameter names and values into a single string
  let message = '';
  for (const key of sortedKeys) {
    message += key + params[key];
  }

  // 3. HMAC SHA256 with secretToken
  return crypto
    .createHmac('sha256', secretToken)
    .update(message)
    .digest('hex');
};

export const verifyPeachWebhookSignature = (
  timestamp: string,
  webhookId: string,
  url: string,
  payload: string,
  signature: string,
  secretToken: string
): boolean => {
  const message = `${timestamp}.${webhookId}.${url}.${payload}`;
  const calculatedSignature = crypto
    .createHmac('sha256', secretToken)
    .update(message)
    .digest('hex');
  
  return calculatedSignature === signature;
};

export const initiatePeachCheckout = async (params: PeachCheckoutParams) => {
  const secretToken = process.env.PEACH_SECRET_TOKEN;
  if (!secretToken) {
    throw new Error('PEACH_SECRET_TOKEN is not set');
  }

  const signature = generatePeachSignature(params, secretToken);
  
  const response = await fetch(process.env.PEACH_API_BASE_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      ...params,
      signature,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Peach API error: ${error}`);
  }

  return await response.json();
};
