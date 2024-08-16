const isEbsiDid = (did: string): boolean => {
  if (!did) return false;
  if (did.match(/^did:ebsi:/g)) {
    return true;
  }
  return false;
};

const isKeyDid = (did: string): boolean => {
  if (!did) return false;
  if (did.match(/^did:key:/g)) {
    return true;
  }
  return false;
};

export { isEbsiDid, isKeyDid };
