import * as qrcode from 'qrcode';

const buildB64QrCode = async function (content: string): Promise<string> {
  return qrcode.toDataURL(content);
};
export { buildB64QrCode };
