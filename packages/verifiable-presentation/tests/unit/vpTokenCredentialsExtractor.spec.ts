import joseWrapper from '../../src/middleware/joseWrapper';
import { VpTokenCredentialsExtractor } from '../../src/utils/vpTokenCredentialsExtractor';
import { CredentialFormat } from '../../src';

describe('vpTokenCredentialExtractor should', () => {
  it('return the list of credentials from vp_token, input: vp_token as object[]', () => {
    const vpToken = [
      {
        id: 'urn:did:57c8dff5-f9bc-40d9-955b-7ebd90ecc995',
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiablePresentation'],
        holder:
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt',
        verifiableCredential: [
          {
            '@context': [
              'https://www.w3.org/2018/credentials/v1',
              'https://api.vidchain.net/api/v1/contexts/v1',
            ],
            type: ['VerifiableCredential', 'EmailCredential'],
            id: 'urn:uuid:1861412c-9e63-4559-b72e-d19049d2138a',
            issuer: {
              id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbo192gbRfxL17YDJKwoeuZJJv2nM8Mybypb7PRSgD7EB7y2A5beFeXofriDLZMFTLPSn2jHX94B3t2vJama86NdUuzZWPauk7EydiwaKuCifYF5tVv6x7Ed8WSmhf9N4oMv',
              name: 'Validated ID SL',
            },
            credentialSubject: {
              id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt',
              email: 'bernat.marcilla@validatedid.com',
            },
            proof: {
              type: 'JsonWebSignature2020',
              created: '2024-03-25T12:27:28.000Z',
              proofPurpose: 'assertionMethod',
              verificationMethod:
                'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbo192gbRfxL17YDJKwoeuZJJv2nM8Mybypb7PRSgD7EB7y2A5beFeXofriDLZMFTLPSn2jHX94B3t2vJama86NdUuzZWPauk7EydiwaKuCifYF5tVv6x7Ed8WSmhf9N4oMv#z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbo192gbRfxL17YDJKwoeuZJJv2nM8Mybypb7PRSgD7EB7y2A5beFeXofriDLZMFTLPSn2jHX94B3t2vJama86NdUuzZWPauk7EydiwaKuCifYF5tVv6x7Ed8WSmhf9N4oMv',
              jws: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtibzE5MmdiUmZ4TDE3WURKS3dvZXVaSkp2Mm5NOE15YnlwYjdQUlNnRDdFQjd5MkE1YmVGZVhvZnJpRExaTUZUTFBTbjJqSFg5NEIzdDJ2SmFtYTg2TmRVdXpaV1BhdWs3RXlkaXdhS3VDaWZZRjV0VnY2eDdFZDhXU21oZjlONG9NdiN6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JvMTkyZ2JSZnhMMTdZREpLd29ldVpKSnYybk04TXlieXBiN1BSU2dEN0VCN3kyQTViZUZlWG9mcmlETFpNRlRMUFNuMmpIWDk0QjN0MnZKYW1hODZOZFV1elpXUGF1azdFeWRpd2FLdUNpZllGNXRWdjZ4N0VkOFdTbWhmOU40b012In0.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYXBpLnZpZGNoYWluLm5ldC9hcGkvdjEvY29udGV4dHMvdjEiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIkVtYWlsQ3JlZGVudGlhbCJdLCJpc3N1ZXIiOnsiaWQiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYm8xOTJnYlJmeEwxN1lESkt3b2V1WkpKdjJuTThNeWJ5cGI3UFJTZ0Q3RUI3eTJBNWJlRmVYb2ZyaURMWk1GVExQU24yakhYOTRCM3QydkphbWE4Nk5kVXV6WldQYXVrN0V5ZGl3YUt1Q2lmWUY1dFZ2Nng3RWQ4V1NtaGY5TjRvTXYiLCJuYW1lIjoiVmFsaWRhdGVkIElEIFNMIn0sImlkIjoidXJuOnV1aWQ6MTg2MTQxMmMtOWU2My00NTU5LWI3MmUtZDE5MDQ5ZDIxMzhhIiwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnA3Y0xaTFJ4c1p1RVRrOUJOZzNvVmFSVERRQ044dVhheXh5ZXQ1WmNqZ1p4dndudU1YWVdHenM3THhYMXM0R1JiTFVKd0ZKSEZ6RWVOekJzNlZ3SzhTSnlqcmlLakU4NnhLRlRFQXdWczdxeVNIa3I4WjN5aW1oc1NMN2JrY003TnQiLCJlbWFpbCI6ImJlcm5hdC5tYXJjaWxsYUB2YWxpZGF0ZWRpZC5jb20ifSwiY3JlZGVudGlhbFN0YXR1cyI6eyJ0eXBlIjoiUmV2b2NhdGlvbkxpc3QyMDIxIiwiaWQiOiJodHRwczovL2Rldi52aWRjaGFpbi5uZXQvYXBpL3YxL3Jldm9jYXRpb24vY3JlZGVudGlhbC1zdGF0dXMvc3RhdHVzLWxpc3QvMjI0L2NyZWRlbnRpYWwvMjYiLCJzdGF0dXNMaXN0Q3JlZGVudGlhbCI6Imh0dHBzOi8vZGV2LnZpZGNoYWluLm5ldC9hcGkvdjEvcmV2b2NhdGlvbi9zdGF0dXMtbGlzdC8yMjQiLCJzdGF0dXNMaXN0SW5kZXgiOiIyNiJ9fSwiaWF0IjoxNzExMzY5NjQ4LCJpc3MiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYm8xOTJnYlJmeEwxN1lESkt3b2V1WkpKdjJuTThNeWJ5cGI3UFJTZ0Q3RUI3eTJBNWJlRmVYb2ZyaURMWk1GVExQU24yakhYOTRCM3QydkphbWE4Nk5kVXV6WldQYXVrN0V5ZGl3YUt1Q2lmWUY1dFZ2Nng3RWQ4V1NtaGY5TjRvTXYifQ.n3x4ndKioax0w1H31Snh4f22pmcI5T7cp8_AMzGiUHygLUxnWXamG00-XiSNMzAe1YqZ8K7hNQ0ZyIbglAeVBQ',
            },
            issuanceDate: '2024-03-25T12:27:28.000Z',
            credentialStatus: {
              type: 'RevocationList2021',
              id: 'https://dev.vidchain.net/api/v1/revocation/credential-status/status-list/224/credential/26',
              statusListCredential:
                'https://dev.vidchain.net/api/v1/revocation/status-list/224',
              statusListIndex: '26',
            },
          },
        ],
        proof: {
          type: 'Ed25519Signature2018',
          created: '2021-03-19T15:30:15Z',
          challenge: 'n-0S6_WzA2Mj',
          domain: 'https://client.example.org/cb',
          jws: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUticDdjTFpMUnhzWnVFVGs5Qk5nM29WYVJURFFDTjh1WGF5eHlldDVaY2pnWnh2d251TVhZV0d6czdMeFgxczRHUmJMVUp3RkpIRnpFZU56QnM2VndLOFNKeWpyaUtqRTg2eEtGVEVBd1ZzN3F5U0hrcjhaM3lpbWhzU0w3YmtjTTdOdCN6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050In0.eyJpYXQiOjE3MTIxNDQ1MjgsImV4cCI6NDg1OTc0MTcwMCwiaXNzIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwiYXVkIjoiaHR0cHM6Ly9zdGFnaW5nLXN0dWRpby52aWRjaGFpbi5uZXQvdmlkY3JlZGVudGlhbHMtc3R1ZGlvL29pZGM0dmMvdjEvdmVyaWZpZXIvNTQxN2FmNjUtNjA1OC00YWI0LWE4OTEtZDBhMDAzNTNlODQ3Iiwic3ViIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwibmJmIjoxNzEyMTQ0NTI4LCJub25jZSI6IjcwY2NmNmUxLTRhY2YtNGI0OC1iODUzLWJjNWU1ZjQ1MjNiMCIsImp0aSI6InVybjpkaWQ6NTdjOGRmZjUtZjliYy00MGQ5LTk1NWItN2ViZDkwZWNjOTk1IiwidnAiOnsiaWQiOiJ1cm46ZGlkOjU3YzhkZmY1LWY5YmMtNDBkOS05NTViLTdlYmQ5MGVjYzk5NSIsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJob2xkZXIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnA3Y0xaTFJ4c1p1RVRrOUJOZzNvVmFSVERRQ044dVhheXh5ZXQ1WmNqZ1p4dndudU1YWVdHenM3THhYMXM0R1JiTFVKd0ZKSEZ6RWVOekJzNlZ3SzhTSnlqcmlLakU4NnhLRlRFQXdWczdxeVNIa3I4WjN5aW1oc1NMN2JrY003TnQiLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6W3siQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiLCJodHRwczovL2FwaS52aWRjaGFpbi5uZXQvYXBpL3YxL2NvbnRleHRzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJFbWFpbENyZWRlbnRpYWwiXSwiaWQiOiJ1cm46dXVpZDoxODYxNDEyYy05ZTYzLTQ1NTktYjcyZS1kMTkwNDlkMjEzOGEiLCJpc3N1ZXIiOnsiaWQiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYm8xOTJnYlJmeEwxN1lESkt3b2V1WkpKdjJuTThNeWJ5cGI3UFJTZ0Q3RUI3eTJBNWJlRmVYb2ZyaURMWk1GVExQU24yakhYOTRCM3QydkphbWE4Nk5kVXV6WldQYXVrN0V5ZGl3YUt1Q2lmWUY1dFZ2Nng3RWQ4V1NtaGY5TjRvTXYiLCJuYW1lIjoiVmFsaWRhdGVkIElEIFNMIn0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwiZW1haWwiOiJiZXJuYXQubWFyY2lsbGFAdmFsaWRhdGVkaWQuY29tIn0sInByb29mIjp7InR5cGUiOiJKc29uV2ViU2lnbmF0dXJlMjAyMCIsImNyZWF0ZWQiOiIyMDI0LTAzLTI1VDEyOjI3OjI4LjAwMFoiLCJwcm9vZlB1cnBvc2UiOiJhc3NlcnRpb25NZXRob2QiLCJ2ZXJpZmljYXRpb25NZXRob2QiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYm8xOTJnYlJmeEwxN1lESkt3b2V1WkpKdjJuTThNeWJ5cGI3UFJTZ0Q3RUI3eTJBNWJlRmVYb2ZyaURMWk1GVExQU24yakhYOTRCM3QydkphbWE4Nk5kVXV6WldQYXVrN0V5ZGl3YUt1Q2lmWUY1dFZ2Nng3RWQ4V1NtaGY5TjRvTXYjejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtibzE5MmdiUmZ4TDE3WURKS3dvZXVaSkp2Mm5NOE15YnlwYjdQUlNnRDdFQjd5MkE1YmVGZVhvZnJpRExaTUZUTFBTbjJqSFg5NEIzdDJ2SmFtYTg2TmRVdXpaV1BhdWs3RXlkaXdhS3VDaWZZRjV0VnY2eDdFZDhXU21oZjlONG9NdiIsImp3cyI6ImV5SmhiR2NpT2lKRlV6STFOaUlzSW5SNWNDSTZJa3BYVkNJc0ltdHBaQ0k2SW1ScFpEcHJaWGs2ZWpKa2JYcEVPREZqWjFCNE9GWnJhVGRLWW5WMVRXMUdXWEpYVUdkWmIzbDBlV3RWV2pObGVYRm9kREZxT1V0aWJ6RTVNbWRpVW1aNFRERTNXVVJLUzNkdlpYVmFTa3AyTW01Tk9FMTVZbmx3WWpkUVVsTm5SRGRGUWpkNU1rRTFZbVZHWlZodlpuSnBSRXhhVFVaVVRGQlRiakpxU0ZnNU5FSXpkREoyU21GdFlUZzJUbVJWZFhwYVYxQmhkV3MzUlhsa2FYZGhTM1ZEYVdaWlJqVjBWblkyZURkRlpEaFhVMjFvWmpsT05HOU5kaU42TW1SdGVrUTRNV05uVUhnNFZtdHBOMHBpZFhWTmJVWlpjbGRRWjFsdmVYUjVhMVZhTTJWNWNXaDBNV281UzJKdk1Ua3laMkpTWm5oTU1UZFpSRXBMZDI5bGRWcEtTbll5YmswNFRYbGllWEJpTjFCU1UyZEVOMFZDTjNreVFUVmlaVVpsV0c5bWNtbEVURnBOUmxSTVVGTnVNbXBJV0RrMFFqTjBNblpLWVcxaE9EWk9aRlYxZWxwWFVHRjFhemRGZVdScGQyRkxkVU5wWmxsR05YUldkalo0TjBWa09GZFRiV2htT1U0MGIwMTJJbjAuZXlKMll5STZleUpBWTI5dWRHVjRkQ0k2V3lKb2RIUndjem92TDNkM2R5NTNNeTV2Y21jdk1qQXhPQzlqY21Wa1pXNTBhV0ZzY3k5Mk1TSXNJbWgwZEhCek9pOHZZWEJwTG5acFpHTm9ZV2x1TG01bGRDOWhjR2t2ZGpFdlkyOXVkR1Y0ZEhNdmRqRWlYU3dpZEhsd1pTSTZXeUpXWlhKcFptbGhZbXhsUTNKbFpHVnVkR2xoYkNJc0lrVnRZV2xzUTNKbFpHVnVkR2xoYkNKZExDSnBjM04xWlhJaU9uc2lhV1FpT2lKa2FXUTZhMlY1T25veVpHMTZSRGd4WTJkUWVEaFdhMmszU21KMWRVMXRSbGx5VjFCbldXOTVkSGxyVlZvelpYbHhhSFF4YWpsTFltOHhPVEpuWWxKbWVFd3hOMWxFU2t0M2IyVjFXa3BLZGpKdVRUaE5lV0o1Y0dJM1VGSlRaMFEzUlVJM2VUSkJOV0psUm1WWWIyWnlhVVJNV2sxR1ZFeFFVMjR5YWtoWU9UUkNNM1F5ZGtwaGJXRTROazVrVlhWNldsZFFZWFZyTjBWNVpHbDNZVXQxUTJsbVdVWTFkRloyTm5nM1JXUTRWMU50YUdZNVRqUnZUWFlpTENKdVlXMWxJam9pVm1Gc2FXUmhkR1ZrSUVsRUlGTk1JbjBzSW1sa0lqb2lkWEp1T25WMWFXUTZNVGcyTVRReE1tTXRPV1UyTXkwME5UVTVMV0kzTW1VdFpERTVNRFE1WkRJeE16aGhJaXdpWTNKbFpHVnVkR2xoYkZOMVltcGxZM1FpT25zaWFXUWlPaUprYVdRNmEyVjVPbm95WkcxNlJEZ3hZMmRRZURoV2EyazNTbUoxZFUxdFJsbHlWMUJuV1c5NWRIbHJWVm96WlhseGFIUXhhamxMWW5BM1kweGFURko0YzFwMVJWUnJPVUpPWnpOdlZtRlNWRVJSUTA0NGRWaGhlWGg1WlhRMVdtTnFaMXA0ZG5kdWRVMVlXVmRIZW5NM1RIaFlNWE0wUjFKaVRGVktkMFpLU0VaNlJXVk9la0p6TmxaM1N6aFRTbmxxY21sTGFrVTRObmhMUmxSRlFYZFdjemR4ZVZOSWEzSTRXak41YVcxb2MxTk1OMkpyWTAwM1RuUWlMQ0psYldGcGJDSTZJbUpsY201aGRDNXRZWEpqYVd4c1lVQjJZV3hwWkdGMFpXUnBaQzVqYjIwaWZTd2lZM0psWkdWdWRHbGhiRk4wWVhSMWN5STZleUowZVhCbElqb2lVbVYyYjJOaGRHbHZia3hwYzNReU1ESXhJaXdpYVdRaU9pSm9kSFJ3Y3pvdkwyUmxkaTUyYVdSamFHRnBiaTV1WlhRdllYQnBMM1l4TDNKbGRtOWpZWFJwYjI0dlkzSmxaR1Z1ZEdsaGJDMXpkR0YwZFhNdmMzUmhkSFZ6TFd4cGMzUXZNakkwTDJOeVpXUmxiblJwWVd3dk1qWWlMQ0p6ZEdGMGRYTk1hWE4wUTNKbFpHVnVkR2xoYkNJNkltaDBkSEJ6T2k4dlpHVjJMblpwWkdOb1lXbHVMbTVsZEM5aGNHa3ZkakV2Y21WMmIyTmhkR2x2Ymk5emRHRjBkWE10YkdsemRDOHlNalFpTENKemRHRjBkWE5NYVhOMFNXNWtaWGdpT2lJeU5pSjlmU3dpYVdGMElqb3hOekV4TXpZNU5qUTRMQ0pwYzNNaU9pSmthV1E2YTJWNU9ub3laRzE2UkRneFkyZFFlRGhXYTJrM1NtSjFkVTF0UmxseVYxQm5XVzk1ZEhsclZWb3paWGx4YUhReGFqbExZbTh4T1RKbllsSm1lRXd4TjFsRVNrdDNiMlYxV2twS2RqSnVUVGhOZVdKNWNHSTNVRkpUWjBRM1JVSTNlVEpCTldKbFJtVlliMlp5YVVSTVdrMUdWRXhRVTI0eWFraFlPVFJDTTNReWRrcGhiV0U0Tms1a1ZYVjZXbGRRWVhWck4wVjVaR2wzWVV0MVEybG1XVVkxZEZaMk5uZzNSV1E0VjFOdGFHWTVUalJ2VFhZaWZRLm4zeDRuZEtpb2F4MHcxSDMxU25oNGYyMnBtY0k1VDdjcDhfQU16R2lVSHlnTFV4bldYYW1HMDAtWGlTTk16QWUxWXFaOEs3aE5RMFp5SWJnbEFlVkJRIn0sImlzc3VhbmNlRGF0ZSI6IjIwMjQtMDMtMjVUMTI6Mjc6MjguMDAwWiIsImNyZWRlbnRpYWxTdGF0dXMiOnsidHlwZSI6IlJldm9jYXRpb25MaXN0MjAyMSIsImlkIjoiaHR0cHM6Ly9kZXYudmlkY2hhaW4ubmV0L2FwaS92MS9yZXZvY2F0aW9uL2NyZWRlbnRpYWwtc3RhdHVzL3N0YXR1cy1saXN0LzIyNC9jcmVkZW50aWFsLzI2Iiwic3RhdHVzTGlzdENyZWRlbnRpYWwiOiJodHRwczovL2Rldi52aWRjaGFpbi5uZXQvYXBpL3YxL3Jldm9jYXRpb24vc3RhdHVzLWxpc3QvMjI0Iiwic3RhdHVzTGlzdEluZGV4IjoiMjYifX1dfX0.2Md0_YH9dcMM5XdfnM4YVtKdLAntr0NSzV6DtzMkSjqq35JqNb18DjUpyigyme8wSUQP-JRD3UMEXlkL_W9GBQ',
          proofPurpose: 'authentication',
          verificationMethod:
            'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt#z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt',
        },
      },
      {
        presentation:
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciJ9.eyJpc3MiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJhdWQiOiJodHRwczovL215LnZlcmlmaWVyLmNvbS9jbGllbnRfaWQiLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJpYXQiOjE1ODk2OTkyNjAsIm5iZiI6MTU4OTY5OTI2MCwiZXhwIjoxNTg5Njk5MjYwLCJub25jZSI6IkZna2VFcmY5MWtmbCIsImp0aSI6InVybjp1dWlkOjA3MDYwNjFhLWUyY2EtNDYxNC05ZGU3LTljMTQ1MTkzNWYwMiIsInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sImlkIjoidXJuOnV1aWQ6MDcwNjA2MWEtZTJjYS00NjE0LTlkZTctOWMxNDUxOTM1ZjAyIiwidHlwZSI6WyJWZXJpZmlhYmxlUHJlc2VudGF0aW9uIl0sImhvbGRlciI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsInZlcmlmaWFibGVDcmVkZW50aWFsIjpbImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSkZVekkxTmlJc0ltdHBaQ0k2SW1ScFpEcGxZbk5wT25wMlNGZFlNelU1UVRORGRtWktia05aWVVGcFFXUmxJMFl3Y2pWUGVYUmZiR0ZvZG5aNk5rMVhiRmx6TTIxaldVNUxXbWxwVVdSVlpuRjJPSFJ6YUVoT09YY2lmUS5leUpwYzNNaU9pSmthV1E2WldKemFUcDZka2hYV0RNMU9VRXpRM1ptU201RFdXRkJhVUZrWlNJc0luTjFZaUk2SW1ScFpEcHJaWGs2ZWpKa2JYcEVPREZqWjFCNE9GWnJhVGRLWW5WMVRXMUdXWEpYVUdkWmIzbDBlV3RWV2pObGVYRm9kREZxT1V0aWMwVlpkbVJ5YW5oTmFsRTBkSEJ1YW1VNVFrUkNWSHAxVGtSUU0ydHVialp4VEZwRmNucGtOR0pLTldkdk1rTkRhRzlRYW1RMVIwRklNM3B3UmtwUU5XWjFkMU5yTmpaVk5WQnhOa1ZvUmpSdVMyNUlla1J1ZW01RlVEaG1XRGs1YmxwSFozZGlRV2d4YnpkSGFqRllOVEpVWkdobU4xVTBTMVJyTmpaNGMwRTFjaUlzSW1saGRDSTZNVFU0T1RZNU9USTJNQ3dpYm1KbUlqb3hOVGc1TmprNU1qWXdMQ0psZUhBaU9qRTFPRGsyT1RreU5qQXNJbXAwYVNJNkluVnlianAxZFdsa1lqWTVNVFpqTVRBdE9HSTJOQzAwTkRJNExUaGlaalV0WTJSbU5EZ3pPRE16TVRCaklpd2lkbU1pT25zaVFHTnZiblJsZUhRaU9sc2lhSFIwY0hNNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TVRndlkzSmxaR1Z1ZEdsaGJITXZkakVpWFN3aWFXUWlPaUoxY200NmRYVnBaRHBpTmpreE5tTXhNQzA0WWpZMExUUTBNamd0T0dKbU5TMWpaR1kwT0RNNE16TXhNR01pTENKMGVYQmxJanBiSWxabGNtbG1hV0ZpYkdWRGNtVmtaVzUwYVdGc0lpd2lWbVZ5YVdacFlXSnNaVUYwZEdWemRHRjBhVzl1SWwwc0ltbHpjM1ZsY2lJNkltUnBaRHBsWW5OcE9ucDJTRmRZTXpVNVFUTkRkbVpLYmtOWllVRnBRV1JsSWl3aWFYTnpkV0Z1WTJWRVlYUmxJam9pTWpBeU1DMHdOUzB4TjFRd056b3dOem8wTUZvaUxDSjJZV3hwWkVaeWIyMGlPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0luWmhiR2xrVlc1MGFXd2lPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0ltVjRjR2x5WVhScGIyNUVZWFJsSWpvaU1qQXlNQzB3TlMweE4xUXdOem93TnpvME1Gb2lMQ0pwYzNOMVpXUWlPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0ltTnlaV1JsYm5ScFlXeFRkV0pxWldOMElqcDdJbWxrSWpvaVpHbGtPbXRsZVRwNk1tUnRla1E0TVdOblVIZzRWbXRwTjBwaWRYVk5iVVpaY2xkUVoxbHZlWFI1YTFWYU0yVjVjV2gwTVdvNVMySnpSVmwyWkhKcWVFMXFVVFIwY0c1cVpUbENSRUpVZW5WT1JGQXphMjV1Tm5GTVdrVnllbVEwWWtvMVoyOHlRME5vYjFCcVpEVkhRVWd6ZW5CR1NsQTFablYzVTJzMk5sVTFVSEUyUldoR05HNUxia2g2Ukc1NmJrVlFPR1pZT1RsdVdrZG5kMkpCYURGdk4wZHFNVmcxTWxSa2FHWTNWVFJMVkdzMk5uaHpRVFZ5SW4wc0ltTnlaV1JsYm5ScFlXeFRZMmhsYldFaU9uc2lhV1FpT2lKb2RIUndjem92TDJGd2FTMXdhV3h2ZEM1bFluTnBMbVYxTDNSeWRYTjBaV1F0YzJOb1pXMWhjeTF5WldkcGMzUnllUzkyTWk5elkyaGxiV0Z6THpCNE1qTXdNemxsTmpNMU5tVmhObUkzTUROalpUWTNNbVUzWTJaaFl6QmlOREkzTmpWaU1UVXdaall6WkdZM09HVXlZbVF4T0dGbE56ZzFOemczWmpaaE1pSXNJblI1Y0dVaU9pSkdkV3hzU25OdmJsTmphR1Z0WVZaaGJHbGtZWFJ2Y2pJd01qRWlmWDE5LkVHc0UxWVhDX1pySkRCY2NxdGFmeUotaG15NnlRcTl5bm5ZTGctcHBQNWRHbkJNdXNMemdaYlNYcmF3TkQ2MWtBRXMwakNjX2NCYjluc0gyR3ZlTXd3IiwiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKRlV6STFOaUlzSW10cFpDSTZJbVJwWkRwbFluTnBPbnAyU0ZkWU16VTVRVE5EZG1aS2JrTlpZVUZwUVdSbEkwWXdjalZQZVhSZmJHRm9kblo2TmsxWGJGbHpNMjFqV1U1TFdtbHBVV1JWWm5GMk9IUnphRWhPT1hjaWZRLmV5SnBjM01pT2lKa2FXUTZaV0p6YVRwNmRraFhXRE0xT1VFelEzWm1TbTVEV1dGQmFVRmtaU0lzSW5OMVlpSTZJbVJwWkRwclpYazZlakprYlhwRU9ERmpaMUI0T0ZacmFUZEtZblYxVFcxR1dYSlhVR2RaYjNsMGVXdFZXak5sZVhGb2RERnFPVXRpYzBWWmRtUnlhbmhOYWxFMGRIQnVhbVU1UWtSQ1ZIcDFUa1JRTTJ0dWJqWnhURnBGY25wa05HSktOV2R2TWtORGFHOVFhbVExUjBGSU0zcHdSa3BRTldaMWQxTnJOalpWTlZCeE5rVm9SalJ1UzI1SWVrUnVlbTVGVURobVdEazVibHBIWjNkaVFXZ3hiemRIYWpGWU5USlVaR2htTjFVMFMxUnJOalo0YzBFMWNpSXNJbWxoZENJNk1UVTRPVFk1T1RJMk1Dd2libUptSWpveE5UZzVOams1TWpZd0xDSmxlSEFpT2pFMU9EazJPVGt5TmpBc0ltcDBhU0k2SW5WeWJqcDFkV2xrWW1KbU16a3lNV1l0TnpCbU1TMDBZakEyTFRnMk56QXRZbVkwWkRWa1kyWmpZVFl6SWl3aWRtTWlPbnNpUUdOdmJuUmxlSFFpT2xzaWFIUjBjSE02THk5M2QzY3Vkek11YjNKbkx6SXdNVGd2WTNKbFpHVnVkR2xoYkhNdmRqRWlYU3dpYVdRaU9pSjFjbTQ2ZFhWcFpEcGlZbVl6T1RJeFppMDNNR1l4TFRSaU1EWXRPRFkzTUMxaVpqUmtOV1JqWm1OaE5qTWlMQ0owZVhCbElqcGJJbFpsY21sbWFXRmliR1ZEY21Wa1pXNTBhV0ZzSWl3aVZtVnlhV1pwWVdKc1pVRjBkR1Z6ZEdGMGFXOXVJbDBzSW1semMzVmxjaUk2SW1ScFpEcGxZbk5wT25wMlNGZFlNelU1UVRORGRtWktia05aWVVGcFFXUmxJaXdpYVhOemRXRnVZMlZFWVhSbElqb2lNakF5TUMwd05TMHhOMVF3Tnpvd056bzBNRm9pTENKMllXeHBaRVp5YjIwaU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW5aaGJHbGtWVzUwYVd3aU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW1WNGNHbHlZWFJwYjI1RVlYUmxJam9pTWpBeU1DMHdOUzB4TjFRd056b3dOem8wTUZvaUxDSnBjM04xWldRaU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW1OeVpXUmxiblJwWVd4VGRXSnFaV04wSWpwN0ltbGtJam9pWkdsa09tdGxlVHA2TW1SdGVrUTRNV05uVUhnNFZtdHBOMHBpZFhWTmJVWlpjbGRRWjFsdmVYUjVhMVZhTTJWNWNXaDBNV281UzJKelJWbDJaSEpxZUUxcVVUUjBjRzVxWlRsQ1JFSlVlblZPUkZBemEyNXVObkZNV2tWeWVtUTBZa28xWjI4eVEwTm9iMUJxWkRWSFFVZ3plbkJHU2xBMVpuVjNVMnMyTmxVMVVIRTJSV2hHTkc1TGJraDZSRzU2YmtWUU9HWllPVGx1V2tkbmQySkJhREZ2TjBkcU1WZzFNbFJrYUdZM1ZUUkxWR3MyTm5oelFUVnlJbjBzSW1OeVpXUmxiblJwWVd4VFkyaGxiV0VpT25zaWFXUWlPaUpvZEhSd2N6b3ZMMkZ3YVMxd2FXeHZkQzVsWW5OcExtVjFMM1J5ZFhOMFpXUXRjMk5vWlcxaGN5MXlaV2RwYzNSeWVTOTJNaTl6WTJobGJXRnpMekI0TWpNd016bGxOak0xTm1WaE5tSTNNRE5qWlRZM01tVTNZMlpoWXpCaU5ESTNOalZpTVRVd1pqWXpaR1kzT0dVeVltUXhPR0ZsTnpnMU56ZzNaalpoTWlJc0luUjVjR1VpT2lKR2RXeHNTbk52YmxOamFHVnRZVlpoYkdsa1lYUnZjakl3TWpFaWZYMTkuc3VyWElVLWo2T0lTU2p3UjlnbTVIVnJ3VmlKWXRTZENFaEp5ZV9kNm1Ib0NJbk1Fb1d4akg0NUl4dEVIREllTTNJcnJXOGIyZjRTei1DZUJlSXdOb3ciLCJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNkltUnBaRHBsWW5OcE9ucDJTRmRZTXpVNVFUTkRkbVpLYmtOWllVRnBRV1JsSTBZd2NqVlBlWFJmYkdGb2RuWjZOazFYYkZsek0yMWpXVTVMV21scFVXUlZabkYyT0hSemFFaE9PWGNpZlEuZXlKcGMzTWlPaUprYVdRNlpXSnphVHA2ZGtoWFdETTFPVUV6UTNabVNtNURXV0ZCYVVGa1pTSXNJbk4xWWlJNkltUnBaRHByWlhrNmVqSmtiWHBFT0RGaloxQjRPRlpyYVRkS1luVjFUVzFHV1hKWFVHZFpiM2wwZVd0VldqTmxlWEZvZERGcU9VdGljMFZaZG1SeWFuaE5hbEUwZEhCdWFtVTVRa1JDVkhwMVRrUlFNMnR1YmpaeFRGcEZjbnBrTkdKS05XZHZNa05EYUc5UWFtUTFSMEZJTTNwd1JrcFFOV1oxZDFOck5qWlZOVkJ4TmtWb1JqUnVTMjVJZWtSdWVtNUZVRGhtV0RrNWJscEhaM2RpUVdneGJ6ZEhhakZZTlRKVVpHaG1OMVUwUzFSck5qWjRjMEUxY2lJc0ltbGhkQ0k2TVRVNE9UWTVPVEkyTUN3aWJtSm1Jam94TlRnNU5qazVNall3TENKbGVIQWlPakUxT0RrMk9Ua3lOakFzSW1wMGFTSTZJblZ5YmpwMWRXbGtZVFJrWVdKaE5XVXRaR1ppTUMwMFpqQmlMVGc0TlRVdE1XTTBaRGszWldJeU5HRXlJaXdpZG1NaU9uc2lRR052Ym5SbGVIUWlPbHNpYUhSMGNITTZMeTkzZDNjdWR6TXViM0puTHpJd01UZ3ZZM0psWkdWdWRHbGhiSE12ZGpFaVhTd2lhV1FpT2lKMWNtNDZkWFZwWkRwaE5HUmhZbUUxWlMxa1ptSXdMVFJtTUdJdE9EZzFOUzB4WXpSa09UZGxZakkwWVRJaUxDSjBlWEJsSWpwYklsWmxjbWxtYVdGaWJHVkRjbVZrWlc1MGFXRnNJaXdpVm1WeWFXWnBZV0pzWlVGMGRHVnpkR0YwYVc5dUlsMHNJbWx6YzNWbGNpSTZJbVJwWkRwbFluTnBPbnAyU0ZkWU16VTVRVE5EZG1aS2JrTlpZVUZwUVdSbElpd2lhWE56ZFdGdVkyVkVZWFJsSWpvaU1qQXlNQzB3TlMweE4xUXdOem93TnpvME1Gb2lMQ0oyWVd4cFpFWnliMjBpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJblpoYkdsa1ZXNTBhV3dpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJbVY0Y0dseVlYUnBiMjVFWVhSbElqb2lNakF5TUMwd05TMHhOMVF3Tnpvd056bzBNRm9pTENKcGMzTjFaV1FpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJbU55WldSbGJuUnBZV3hUZFdKcVpXTjBJanA3SW1sa0lqb2laR2xrT210bGVUcDZNbVJ0ZWtRNE1XTm5VSGc0Vm10cE4wcGlkWFZOYlVaWmNsZFFaMWx2ZVhSNWExVmFNMlY1Y1doME1XbzVTMkp6UlZsMlpISnFlRTFxVVRSMGNHNXFaVGxDUkVKVWVuVk9SRkF6YTI1dU5uRk1Xa1Z5ZW1RMFlrbzFaMjh5UTBOb2IxQnFaRFZIUVVnemVuQkdTbEExWm5WM1UyczJObFUxVUhFMlJXaEdORzVMYmtoNlJHNTZia1ZRT0daWU9UbHVXa2RuZDJKQmFERnZOMGRxTVZnMU1sUmthR1kzVlRSTFZHczJObmh6UVRWeUluMHNJbU55WldSbGJuUnBZV3hUWTJobGJXRWlPbnNpYVdRaU9pSm9kSFJ3Y3pvdkwyRndhUzF3YVd4dmRDNWxZbk5wTG1WMUwzUnlkWE4wWldRdGMyTm9aVzFoY3kxeVpXZHBjM1J5ZVM5Mk1pOXpZMmhsYldGekx6QjRNak13TXpsbE5qTTFObVZoTm1JM01ETmpaVFkzTW1VM1kyWmhZekJpTkRJM05qVmlNVFV3WmpZelpHWTNPR1V5WW1ReE9HRmxOemcxTnpnM1pqWmhNaUlzSW5SNWNHVWlPaUpHZFd4c1NuTnZibE5qYUdWdFlWWmhiR2xrWVhSdmNqSXdNakVpZlgxOS5QSUNDWldCNnA1elFveFZKT2Z0MXlRU09Gb1RncFM4cVdUUDNDdGdRN0hCSFN0VFNuVEllbGpncVBaaXZHbHNhOVItQW5aZlNtcGxwaTF3X21fZVlRUSJdfX0.HBfJM7yaYgz0Lm93fGFKnQb56r5DUIRZ_lSWaRFdPspzeI4sD0vTh2r2sSj7f3VjiJLPCc0eZivRuq28YmyUOA',
      },
    ];
    const presentationSubmission = {
      id: 'Selective disclosure example presentation',
      definition_id: 'Selective disclosure example',
      descriptor_map: [
        {
          id: 'ID Card with constraints',
          format: 'ldp_vp',
          path: '$[0]',
          path_nested: {
            format: 'ldp_vc',
            path: '$[0].verifiableCredential[0]',
          },
        },
        {
          id: 'Ontario Health Insurance Plan',
          format: 'jwt_vp',
          path: '$[1].presentation',
          path_nested: {
            format: 'jwt_vc',
            path: '$[1].presentation.vp.verifiableCredential[0]',
          },
        },
      ],
    };

    const vpTokenCredentialsExtractor = new VpTokenCredentialsExtractor(
      vpToken,
      presentationSubmission,
    );

    const credentials = vpTokenCredentialsExtractor.extract();

    const decodedCredential = joseWrapper.decodeJWT(
      vpToken[0].verifiableCredential[0].proof.jws,
    );
    expect(credentials).toEqual({
      result: { valid: true },
      vpTokenData: {
        vpToken,
        descriptorMapIds: [
          'ID Card with constraints',
          'Ontario Health Insurance Plan',
        ],
        verifiableCredentialsDecoded: [
          decodedCredential,
          {
            iss: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
            sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
            iat: 1589699260,
            nbf: 1589699260,
            exp: 1589699260,
            jti: 'urn:uuidb6916c10-8b64-4428-8bf5-cdf48383310c',
            vc: {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              id: 'urn:uuid:b6916c10-8b64-4428-8bf5-cdf48383310c',
              type: ['VerifiableCredential', 'VerifiableAttestation'],
              issuer: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
              issuanceDate: '2020-05-17T07:07:40Z',
              validFrom: '2020-05-17T07:07:40Z',
              validUntil: '2020-05-17T07:07:40Z',
              expirationDate: '2020-05-17T07:07:40Z',
              issued: '2020-05-17T07:07:40Z',
              credentialSubject: {
                id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
              },
              credentialSchema: {
                id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/0x23039e6356ea6b703ce672e7cfac0b42765b150f63df78e2bd18ae785787f6a2',
                type: 'FullJsonSchemaValidator2021',
              },
            },
          },
        ],
        verifiableCredentials: [
          {
            format: CredentialFormat.JSON,
            verifiableCredential: vpToken[0].verifiableCredential[0],
          },
          {
            format: CredentialFormat.JWT,
            verifiableCredential:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYjY5MTZjMTAtOGI2NC00NDI4LThiZjUtY2RmNDgzODMzMTBjIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDpiNjkxNmMxMC04YjY0LTQ0MjgtOGJmNS1jZGY0ODM4MzMxMGMiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.EGsE1YXC_ZrJDBccqtafyJ-hmy6yQq9ynnYLg-ppP5dGnBMusLzgZbSXrawND61kAEs0jCc_cBb9nsH2GveMww',
          },
        ],
        vpTokenIssuer:
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt',
        decodedVerifiablePresentation: {
          aud: 'https://my.verifier.com/client_id',
          exp: 1589699260,
          iat: 1589699260,
          iss: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
          jti: 'urn:uuid:0706061a-e2ca-4614-9de7-9c1451935f02',
          nbf: 1589699260,
          nonce: 'FgkeErf91kfl',
          sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
          vp: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            holder:
              'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
            id: 'urn:uuid:0706061a-e2ca-4614-9de7-9c1451935f02',
            type: ['VerifiablePresentation'],
            verifiableCredential: [
              {
                exp: 1589699260,
                iat: 1589699260,
                iss: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
                jti: 'urn:uuidb6916c10-8b64-4428-8bf5-cdf48383310c',
                nbf: 1589699260,
                sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
                vc: {
                  '@context': ['https://www.w3.org/2018/credentials/v1'],
                  credentialSchema: {
                    id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/0x23039e6356ea6b703ce672e7cfac0b42765b150f63df78e2bd18ae785787f6a2',
                    type: 'FullJsonSchemaValidator2021',
                  },
                  credentialSubject: {
                    id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
                  },
                  expirationDate: '2020-05-17T07:07:40Z',
                  id: 'urn:uuid:b6916c10-8b64-4428-8bf5-cdf48383310c',
                  issuanceDate: '2020-05-17T07:07:40Z',
                  issued: '2020-05-17T07:07:40Z',
                  issuer: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
                  type: ['VerifiableCredential', 'VerifiableAttestation'],
                  validFrom: '2020-05-17T07:07:40Z',
                  validUntil: '2020-05-17T07:07:40Z',
                },
              },
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYmJmMzkyMWYtNzBmMS00YjA2LTg2NzAtYmY0ZDVkY2ZjYTYzIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDpiYmYzOTIxZi03MGYxLTRiMDYtODY3MC1iZjRkNWRjZmNhNjMiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.surXIU-j6OISSjwR9gm5HVrwViJYtSdCEhJye_d6mHoCInMEoWxjH45IxtEHDIeM3IrrW8b2f4Sz-CeBeIwNow',
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYTRkYWJhNWUtZGZiMC00ZjBiLTg4NTUtMWM0ZDk3ZWIyNGEyIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDphNGRhYmE1ZS1kZmIwLTRmMGItODg1NS0xYzRkOTdlYjI0YTIiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.PICCZWB6p5zQoxVJOft1yQSOFoTgpS8qWTP3CtgQ7HBHStTSnTIeljgqPZivGlsa9R-AnZfSmplpi1w_m_eYQQ',
            ],
          },
        },
      },
    });
  });

  it('throw an error when bad credential path is specified on presentationSubmission', () => {
    const vpToken = [
      {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiablePresentation'],
        verifiableCredential: [],
        id: 'ebc6f1c2',
        holder: 'did:example:holder',
        proof: {
          type: 'Ed25519Signature2018',
          created: '2021-03-19T15:30:15Z',
          challenge: 'n-0S6_WzA2Mj',
          domain: 'https://client.example.org/cb',
          jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..GF5Z6TamgNE8QjE3RbiDOj3n_t25_1K7NVWMUASe_OEzQV63GaKdu235MCS3hIYvepcNdQ_ZOKpGNCf0vIAoDA',
          proofPurpose: 'authentication',
          verificationMethod: 'did:example:holder#key-1',
        },
      },
    ];
    const presentationSubmission = {
      id: 'Selective disclosure example presentation',
      definition_id: 'Selective disclosure example',
      descriptor_map: [
        {
          id: 'ID Card with constraints',
          format: 'ldp_vp',
          path: '$[0]',
          path_nested: {
            format: 'ldp_vc',
            path: '$[0].verifiableCredential[0]',
          },
        },
      ],
    };

    const vpTokenCredentialsExtractor = new VpTokenCredentialsExtractor(
      vpToken,
      presentationSubmission,
    );

    const result = vpTokenCredentialsExtractor.extract();
    expect(result).toEqual({
      result: {
        valid: false,
        message:
          'Verifiable presentation/credential not found for this path: $[0].verifiableCredential[0]',
      },
      vpTokenData: {
        vpToken,
      },
    });
  });

  it('return the list of credentials from vp_token, input: vp_token as object', () => {
    const vpToken = {
      id: 'urn:did:57c8dff5-f9bc-40d9-955b-7ebd90ecc995',
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      holder:
        'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt',
      verifiableCredential: [
        {
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://api.vidchain.net/api/v1/contexts/v1',
          ],
          type: ['VerifiableCredential', 'EmailCredential'],
          id: 'urn:uuid:1861412c-9e63-4559-b72e-d19049d2138a',
          issuer: {
            id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbo192gbRfxL17YDJKwoeuZJJv2nM8Mybypb7PRSgD7EB7y2A5beFeXofriDLZMFTLPSn2jHX94B3t2vJama86NdUuzZWPauk7EydiwaKuCifYF5tVv6x7Ed8WSmhf9N4oMv',
            name: 'Validated ID SL',
          },
          credentialSubject: {
            id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt',
            email: 'bernat.marcilla@validatedid.com',
          },
          proof: {
            type: 'JsonWebSignature2020',
            created: '2024-03-25T12:27:28.000Z',
            proofPurpose: 'assertionMethod',
            verificationMethod:
              'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbo192gbRfxL17YDJKwoeuZJJv2nM8Mybypb7PRSgD7EB7y2A5beFeXofriDLZMFTLPSn2jHX94B3t2vJama86NdUuzZWPauk7EydiwaKuCifYF5tVv6x7Ed8WSmhf9N4oMv#z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbo192gbRfxL17YDJKwoeuZJJv2nM8Mybypb7PRSgD7EB7y2A5beFeXofriDLZMFTLPSn2jHX94B3t2vJama86NdUuzZWPauk7EydiwaKuCifYF5tVv6x7Ed8WSmhf9N4oMv',
            jws: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtibzE5MmdiUmZ4TDE3WURKS3dvZXVaSkp2Mm5NOE15YnlwYjdQUlNnRDdFQjd5MkE1YmVGZVhvZnJpRExaTUZUTFBTbjJqSFg5NEIzdDJ2SmFtYTg2TmRVdXpaV1BhdWs3RXlkaXdhS3VDaWZZRjV0VnY2eDdFZDhXU21oZjlONG9NdiN6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JvMTkyZ2JSZnhMMTdZREpLd29ldVpKSnYybk04TXlieXBiN1BSU2dEN0VCN3kyQTViZUZlWG9mcmlETFpNRlRMUFNuMmpIWDk0QjN0MnZKYW1hODZOZFV1elpXUGF1azdFeWRpd2FLdUNpZllGNXRWdjZ4N0VkOFdTbWhmOU40b012In0.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYXBpLnZpZGNoYWluLm5ldC9hcGkvdjEvY29udGV4dHMvdjEiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIkVtYWlsQ3JlZGVudGlhbCJdLCJpc3N1ZXIiOnsiaWQiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYm8xOTJnYlJmeEwxN1lESkt3b2V1WkpKdjJuTThNeWJ5cGI3UFJTZ0Q3RUI3eTJBNWJlRmVYb2ZyaURMWk1GVExQU24yakhYOTRCM3QydkphbWE4Nk5kVXV6WldQYXVrN0V5ZGl3YUt1Q2lmWUY1dFZ2Nng3RWQ4V1NtaGY5TjRvTXYiLCJuYW1lIjoiVmFsaWRhdGVkIElEIFNMIn0sImlkIjoidXJuOnV1aWQ6MTg2MTQxMmMtOWU2My00NTU5LWI3MmUtZDE5MDQ5ZDIxMzhhIiwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnA3Y0xaTFJ4c1p1RVRrOUJOZzNvVmFSVERRQ044dVhheXh5ZXQ1WmNqZ1p4dndudU1YWVdHenM3THhYMXM0R1JiTFVKd0ZKSEZ6RWVOekJzNlZ3SzhTSnlqcmlLakU4NnhLRlRFQXdWczdxeVNIa3I4WjN5aW1oc1NMN2JrY003TnQiLCJlbWFpbCI6ImJlcm5hdC5tYXJjaWxsYUB2YWxpZGF0ZWRpZC5jb20ifSwiY3JlZGVudGlhbFN0YXR1cyI6eyJ0eXBlIjoiUmV2b2NhdGlvbkxpc3QyMDIxIiwiaWQiOiJodHRwczovL2Rldi52aWRjaGFpbi5uZXQvYXBpL3YxL3Jldm9jYXRpb24vY3JlZGVudGlhbC1zdGF0dXMvc3RhdHVzLWxpc3QvMjI0L2NyZWRlbnRpYWwvMjYiLCJzdGF0dXNMaXN0Q3JlZGVudGlhbCI6Imh0dHBzOi8vZGV2LnZpZGNoYWluLm5ldC9hcGkvdjEvcmV2b2NhdGlvbi9zdGF0dXMtbGlzdC8yMjQiLCJzdGF0dXNMaXN0SW5kZXgiOiIyNiJ9fSwiaWF0IjoxNzExMzY5NjQ4LCJpc3MiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYm8xOTJnYlJmeEwxN1lESkt3b2V1WkpKdjJuTThNeWJ5cGI3UFJTZ0Q3RUI3eTJBNWJlRmVYb2ZyaURMWk1GVExQU24yakhYOTRCM3QydkphbWE4Nk5kVXV6WldQYXVrN0V5ZGl3YUt1Q2lmWUY1dFZ2Nng3RWQ4V1NtaGY5TjRvTXYifQ.n3x4ndKioax0w1H31Snh4f22pmcI5T7cp8_AMzGiUHygLUxnWXamG00-XiSNMzAe1YqZ8K7hNQ0ZyIbglAeVBQ',
          },
          issuanceDate: '2024-03-25T12:27:28.000Z',
          credentialStatus: {
            type: 'RevocationList2021',
            id: 'https://dev.vidchain.net/api/v1/revocation/credential-status/status-list/224/credential/26',
            statusListCredential:
              'https://dev.vidchain.net/api/v1/revocation/status-list/224',
            statusListIndex: '26',
          },
        },
      ],
      proof: {
        type: 'Ed25519Signature2018',
        created: '2021-03-19T15:30:15Z',
        challenge: 'n-0S6_WzA2Mj',
        domain: 'https://client.example.org/cb',
        jws: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUticDdjTFpMUnhzWnVFVGs5Qk5nM29WYVJURFFDTjh1WGF5eHlldDVaY2pnWnh2d251TVhZV0d6czdMeFgxczRHUmJMVUp3RkpIRnpFZU56QnM2VndLOFNKeWpyaUtqRTg2eEtGVEVBd1ZzN3F5U0hrcjhaM3lpbWhzU0w3YmtjTTdOdCN6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050In0.eyJpYXQiOjE3MTIxNDQ1MjgsImV4cCI6NDg1OTc0MTcwMCwiaXNzIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwiYXVkIjoiaHR0cHM6Ly9zdGFnaW5nLXN0dWRpby52aWRjaGFpbi5uZXQvdmlkY3JlZGVudGlhbHMtc3R1ZGlvL29pZGM0dmMvdjEvdmVyaWZpZXIvNTQxN2FmNjUtNjA1OC00YWI0LWE4OTEtZDBhMDAzNTNlODQ3Iiwic3ViIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwibmJmIjoxNzEyMTQ0NTI4LCJub25jZSI6IjcwY2NmNmUxLTRhY2YtNGI0OC1iODUzLWJjNWU1ZjQ1MjNiMCIsImp0aSI6InVybjpkaWQ6NTdjOGRmZjUtZjliYy00MGQ5LTk1NWItN2ViZDkwZWNjOTk1IiwidnAiOnsiaWQiOiJ1cm46ZGlkOjU3YzhkZmY1LWY5YmMtNDBkOS05NTViLTdlYmQ5MGVjYzk5NSIsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJob2xkZXIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnA3Y0xaTFJ4c1p1RVRrOUJOZzNvVmFSVERRQ044dVhheXh5ZXQ1WmNqZ1p4dndudU1YWVdHenM3THhYMXM0R1JiTFVKd0ZKSEZ6RWVOekJzNlZ3SzhTSnlqcmlLakU4NnhLRlRFQXdWczdxeVNIa3I4WjN5aW1oc1NMN2JrY003TnQiLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6W3siQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiLCJodHRwczovL2FwaS52aWRjaGFpbi5uZXQvYXBpL3YxL2NvbnRleHRzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJFbWFpbENyZWRlbnRpYWwiXSwiaWQiOiJ1cm46dXVpZDoxODYxNDEyYy05ZTYzLTQ1NTktYjcyZS1kMTkwNDlkMjEzOGEiLCJpc3N1ZXIiOnsiaWQiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYm8xOTJnYlJmeEwxN1lESkt3b2V1WkpKdjJuTThNeWJ5cGI3UFJTZ0Q3RUI3eTJBNWJlRmVYb2ZyaURMWk1GVExQU24yakhYOTRCM3QydkphbWE4Nk5kVXV6WldQYXVrN0V5ZGl3YUt1Q2lmWUY1dFZ2Nng3RWQ4V1NtaGY5TjRvTXYiLCJuYW1lIjoiVmFsaWRhdGVkIElEIFNMIn0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwiZW1haWwiOiJiZXJuYXQubWFyY2lsbGFAdmFsaWRhdGVkaWQuY29tIn0sInByb29mIjp7InR5cGUiOiJKc29uV2ViU2lnbmF0dXJlMjAyMCIsImNyZWF0ZWQiOiIyMDI0LTAzLTI1VDEyOjI3OjI4LjAwMFoiLCJwcm9vZlB1cnBvc2UiOiJhc3NlcnRpb25NZXRob2QiLCJ2ZXJpZmljYXRpb25NZXRob2QiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYm8xOTJnYlJmeEwxN1lESkt3b2V1WkpKdjJuTThNeWJ5cGI3UFJTZ0Q3RUI3eTJBNWJlRmVYb2ZyaURMWk1GVExQU24yakhYOTRCM3QydkphbWE4Nk5kVXV6WldQYXVrN0V5ZGl3YUt1Q2lmWUY1dFZ2Nng3RWQ4V1NtaGY5TjRvTXYjejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtibzE5MmdiUmZ4TDE3WURKS3dvZXVaSkp2Mm5NOE15YnlwYjdQUlNnRDdFQjd5MkE1YmVGZVhvZnJpRExaTUZUTFBTbjJqSFg5NEIzdDJ2SmFtYTg2TmRVdXpaV1BhdWs3RXlkaXdhS3VDaWZZRjV0VnY2eDdFZDhXU21oZjlONG9NdiIsImp3cyI6ImV5SmhiR2NpT2lKRlV6STFOaUlzSW5SNWNDSTZJa3BYVkNJc0ltdHBaQ0k2SW1ScFpEcHJaWGs2ZWpKa2JYcEVPREZqWjFCNE9GWnJhVGRLWW5WMVRXMUdXWEpYVUdkWmIzbDBlV3RWV2pObGVYRm9kREZxT1V0aWJ6RTVNbWRpVW1aNFRERTNXVVJLUzNkdlpYVmFTa3AyTW01Tk9FMTVZbmx3WWpkUVVsTm5SRGRGUWpkNU1rRTFZbVZHWlZodlpuSnBSRXhhVFVaVVRGQlRiakpxU0ZnNU5FSXpkREoyU21GdFlUZzJUbVJWZFhwYVYxQmhkV3MzUlhsa2FYZGhTM1ZEYVdaWlJqVjBWblkyZURkRlpEaFhVMjFvWmpsT05HOU5kaU42TW1SdGVrUTRNV05uVUhnNFZtdHBOMHBpZFhWTmJVWlpjbGRRWjFsdmVYUjVhMVZhTTJWNWNXaDBNV281UzJKdk1Ua3laMkpTWm5oTU1UZFpSRXBMZDI5bGRWcEtTbll5YmswNFRYbGllWEJpTjFCU1UyZEVOMFZDTjNreVFUVmlaVVpsV0c5bWNtbEVURnBOUmxSTVVGTnVNbXBJV0RrMFFqTjBNblpLWVcxaE9EWk9aRlYxZWxwWFVHRjFhemRGZVdScGQyRkxkVU5wWmxsR05YUldkalo0TjBWa09GZFRiV2htT1U0MGIwMTJJbjAuZXlKMll5STZleUpBWTI5dWRHVjRkQ0k2V3lKb2RIUndjem92TDNkM2R5NTNNeTV2Y21jdk1qQXhPQzlqY21Wa1pXNTBhV0ZzY3k5Mk1TSXNJbWgwZEhCek9pOHZZWEJwTG5acFpHTm9ZV2x1TG01bGRDOWhjR2t2ZGpFdlkyOXVkR1Y0ZEhNdmRqRWlYU3dpZEhsd1pTSTZXeUpXWlhKcFptbGhZbXhsUTNKbFpHVnVkR2xoYkNJc0lrVnRZV2xzUTNKbFpHVnVkR2xoYkNKZExDSnBjM04xWlhJaU9uc2lhV1FpT2lKa2FXUTZhMlY1T25veVpHMTZSRGd4WTJkUWVEaFdhMmszU21KMWRVMXRSbGx5VjFCbldXOTVkSGxyVlZvelpYbHhhSFF4YWpsTFltOHhPVEpuWWxKbWVFd3hOMWxFU2t0M2IyVjFXa3BLZGpKdVRUaE5lV0o1Y0dJM1VGSlRaMFEzUlVJM2VUSkJOV0psUm1WWWIyWnlhVVJNV2sxR1ZFeFFVMjR5YWtoWU9UUkNNM1F5ZGtwaGJXRTROazVrVlhWNldsZFFZWFZyTjBWNVpHbDNZVXQxUTJsbVdVWTFkRloyTm5nM1JXUTRWMU50YUdZNVRqUnZUWFlpTENKdVlXMWxJam9pVm1Gc2FXUmhkR1ZrSUVsRUlGTk1JbjBzSW1sa0lqb2lkWEp1T25WMWFXUTZNVGcyTVRReE1tTXRPV1UyTXkwME5UVTVMV0kzTW1VdFpERTVNRFE1WkRJeE16aGhJaXdpWTNKbFpHVnVkR2xoYkZOMVltcGxZM1FpT25zaWFXUWlPaUprYVdRNmEyVjVPbm95WkcxNlJEZ3hZMmRRZURoV2EyazNTbUoxZFUxdFJsbHlWMUJuV1c5NWRIbHJWVm96WlhseGFIUXhhamxMWW5BM1kweGFURko0YzFwMVJWUnJPVUpPWnpOdlZtRlNWRVJSUTA0NGRWaGhlWGg1WlhRMVdtTnFaMXA0ZG5kdWRVMVlXVmRIZW5NM1RIaFlNWE0wUjFKaVRGVktkMFpLU0VaNlJXVk9la0p6TmxaM1N6aFRTbmxxY21sTGFrVTRObmhMUmxSRlFYZFdjemR4ZVZOSWEzSTRXak41YVcxb2MxTk1OMkpyWTAwM1RuUWlMQ0psYldGcGJDSTZJbUpsY201aGRDNXRZWEpqYVd4c1lVQjJZV3hwWkdGMFpXUnBaQzVqYjIwaWZTd2lZM0psWkdWdWRHbGhiRk4wWVhSMWN5STZleUowZVhCbElqb2lVbVYyYjJOaGRHbHZia3hwYzNReU1ESXhJaXdpYVdRaU9pSm9kSFJ3Y3pvdkwyUmxkaTUyYVdSamFHRnBiaTV1WlhRdllYQnBMM1l4TDNKbGRtOWpZWFJwYjI0dlkzSmxaR1Z1ZEdsaGJDMXpkR0YwZFhNdmMzUmhkSFZ6TFd4cGMzUXZNakkwTDJOeVpXUmxiblJwWVd3dk1qWWlMQ0p6ZEdGMGRYTk1hWE4wUTNKbFpHVnVkR2xoYkNJNkltaDBkSEJ6T2k4dlpHVjJMblpwWkdOb1lXbHVMbTVsZEM5aGNHa3ZkakV2Y21WMmIyTmhkR2x2Ymk5emRHRjBkWE10YkdsemRDOHlNalFpTENKemRHRjBkWE5NYVhOMFNXNWtaWGdpT2lJeU5pSjlmU3dpYVdGMElqb3hOekV4TXpZNU5qUTRMQ0pwYzNNaU9pSmthV1E2YTJWNU9ub3laRzE2UkRneFkyZFFlRGhXYTJrM1NtSjFkVTF0UmxseVYxQm5XVzk1ZEhsclZWb3paWGx4YUhReGFqbExZbTh4T1RKbllsSm1lRXd4TjFsRVNrdDNiMlYxV2twS2RqSnVUVGhOZVdKNWNHSTNVRkpUWjBRM1JVSTNlVEpCTldKbFJtVlliMlp5YVVSTVdrMUdWRXhRVTI0eWFraFlPVFJDTTNReWRrcGhiV0U0Tms1a1ZYVjZXbGRRWVhWck4wVjVaR2wzWVV0MVEybG1XVVkxZEZaMk5uZzNSV1E0VjFOdGFHWTVUalJ2VFhZaWZRLm4zeDRuZEtpb2F4MHcxSDMxU25oNGYyMnBtY0k1VDdjcDhfQU16R2lVSHlnTFV4bldYYW1HMDAtWGlTTk16QWUxWXFaOEs3aE5RMFp5SWJnbEFlVkJRIn0sImlzc3VhbmNlRGF0ZSI6IjIwMjQtMDMtMjVUMTI6Mjc6MjguMDAwWiIsImNyZWRlbnRpYWxTdGF0dXMiOnsidHlwZSI6IlJldm9jYXRpb25MaXN0MjAyMSIsImlkIjoiaHR0cHM6Ly9kZXYudmlkY2hhaW4ubmV0L2FwaS92MS9yZXZvY2F0aW9uL2NyZWRlbnRpYWwtc3RhdHVzL3N0YXR1cy1saXN0LzIyNC9jcmVkZW50aWFsLzI2Iiwic3RhdHVzTGlzdENyZWRlbnRpYWwiOiJodHRwczovL2Rldi52aWRjaGFpbi5uZXQvYXBpL3YxL3Jldm9jYXRpb24vc3RhdHVzLWxpc3QvMjI0Iiwic3RhdHVzTGlzdEluZGV4IjoiMjYifX1dfX0.2Md0_YH9dcMM5XdfnM4YVtKdLAntr0NSzV6DtzMkSjqq35JqNb18DjUpyigyme8wSUQP-JRD3UMEXlkL_W9GBQ',
        proofPurpose: 'authentication',
        verificationMethod:
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt#z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt',
      },
    };
    const presentationSubmission = {
      id: 'Selective disclosure example presentation',
      definition_id: 'Selective disclosure example',
      descriptor_map: [
        {
          id: 'ID Card with constraints',
          format: 'ldp_vp',
          path: '$',
          path_nested: {
            format: 'ldp_vc',
            path: '$.verifiableCredential[0]',
          },
        },
      ],
    };

    const vpTokenCredentialsExtractor = new VpTokenCredentialsExtractor(
      vpToken,
      presentationSubmission,
    );

    const credentials = vpTokenCredentialsExtractor.extract();

    const decodedCredential = joseWrapper.decodeJWT(
      vpToken.verifiableCredential[0].proof.jws,
    );
    expect(credentials).toEqual({
      result: { valid: true },
      vpTokenData: {
        vpToken,
        descriptorMapIds: ['ID Card with constraints'],
        verifiableCredentialsDecoded: [decodedCredential],
        verifiableCredentials: [
          {
            format: CredentialFormat.JSON,
            verifiableCredential: vpToken.verifiableCredential[0],
          },
        ],
        vpTokenIssuer:
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt',
        decodedVerifiablePresentation: {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          holder:
            'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt',
          id: 'urn:did:57c8dff5-f9bc-40d9-955b-7ebd90ecc995',
          proof: {
            challenge: 'n-0S6_WzA2Mj',
            created: '2021-03-19T15:30:15Z',
            domain: 'https://client.example.org/cb',
            jws: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUticDdjTFpMUnhzWnVFVGs5Qk5nM29WYVJURFFDTjh1WGF5eHlldDVaY2pnWnh2d251TVhZV0d6czdMeFgxczRHUmJMVUp3RkpIRnpFZU56QnM2VndLOFNKeWpyaUtqRTg2eEtGVEVBd1ZzN3F5U0hrcjhaM3lpbWhzU0w3YmtjTTdOdCN6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050In0.eyJpYXQiOjE3MTIxNDQ1MjgsImV4cCI6NDg1OTc0MTcwMCwiaXNzIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwiYXVkIjoiaHR0cHM6Ly9zdGFnaW5nLXN0dWRpby52aWRjaGFpbi5uZXQvdmlkY3JlZGVudGlhbHMtc3R1ZGlvL29pZGM0dmMvdjEvdmVyaWZpZXIvNTQxN2FmNjUtNjA1OC00YWI0LWE4OTEtZDBhMDAzNTNlODQ3Iiwic3ViIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwibmJmIjoxNzEyMTQ0NTI4LCJub25jZSI6IjcwY2NmNmUxLTRhY2YtNGI0OC1iODUzLWJjNWU1ZjQ1MjNiMCIsImp0aSI6InVybjpkaWQ6NTdjOGRmZjUtZjliYy00MGQ5LTk1NWItN2ViZDkwZWNjOTk1IiwidnAiOnsiaWQiOiJ1cm46ZGlkOjU3YzhkZmY1LWY5YmMtNDBkOS05NTViLTdlYmQ5MGVjYzk5NSIsIkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJob2xkZXIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnA3Y0xaTFJ4c1p1RVRrOUJOZzNvVmFSVERRQ044dVhheXh5ZXQ1WmNqZ1p4dndudU1YWVdHenM3THhYMXM0R1JiTFVKd0ZKSEZ6RWVOekJzNlZ3SzhTSnlqcmlLakU4NnhLRlRFQXdWczdxeVNIa3I4WjN5aW1oc1NMN2JrY003TnQiLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6W3siQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiLCJodHRwczovL2FwaS52aWRjaGFpbi5uZXQvYXBpL3YxL2NvbnRleHRzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJFbWFpbENyZWRlbnRpYWwiXSwiaWQiOiJ1cm46dXVpZDoxODYxNDEyYy05ZTYzLTQ1NTktYjcyZS1kMTkwNDlkMjEzOGEiLCJpc3N1ZXIiOnsiaWQiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYm8xOTJnYlJmeEwxN1lESkt3b2V1WkpKdjJuTThNeWJ5cGI3UFJTZ0Q3RUI3eTJBNWJlRmVYb2ZyaURMWk1GVExQU24yakhYOTRCM3QydkphbWE4Nk5kVXV6WldQYXVrN0V5ZGl3YUt1Q2lmWUY1dFZ2Nng3RWQ4V1NtaGY5TjRvTXYiLCJuYW1lIjoiVmFsaWRhdGVkIElEIFNMIn0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JwN2NMWkxSeHNadUVUazlCTmczb1ZhUlREUUNOOHVYYXl4eWV0NVpjamdaeHZ3bnVNWFlXR3pzN0x4WDFzNEdSYkxVSndGSkhGekVlTnpCczZWd0s4U0p5anJpS2pFODZ4S0ZURUF3VnM3cXlTSGtyOFozeWltaHNTTDdia2NNN050IiwiZW1haWwiOiJiZXJuYXQubWFyY2lsbGFAdmFsaWRhdGVkaWQuY29tIn0sInByb29mIjp7InR5cGUiOiJKc29uV2ViU2lnbmF0dXJlMjAyMCIsImNyZWF0ZWQiOiIyMDI0LTAzLTI1VDEyOjI3OjI4LjAwMFoiLCJwcm9vZlB1cnBvc2UiOiJhc3NlcnRpb25NZXRob2QiLCJ2ZXJpZmljYXRpb25NZXRob2QiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYm8xOTJnYlJmeEwxN1lESkt3b2V1WkpKdjJuTThNeWJ5cGI3UFJTZ0Q3RUI3eTJBNWJlRmVYb2ZyaURMWk1GVExQU24yakhYOTRCM3QydkphbWE4Nk5kVXV6WldQYXVrN0V5ZGl3YUt1Q2lmWUY1dFZ2Nng3RWQ4V1NtaGY5TjRvTXYjejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtibzE5MmdiUmZ4TDE3WURKS3dvZXVaSkp2Mm5NOE15YnlwYjdQUlNnRDdFQjd5MkE1YmVGZVhvZnJpRExaTUZUTFBTbjJqSFg5NEIzdDJ2SmFtYTg2TmRVdXpaV1BhdWs3RXlkaXdhS3VDaWZZRjV0VnY2eDdFZDhXU21oZjlONG9NdiIsImp3cyI6ImV5SmhiR2NpT2lKRlV6STFOaUlzSW5SNWNDSTZJa3BYVkNJc0ltdHBaQ0k2SW1ScFpEcHJaWGs2ZWpKa2JYcEVPREZqWjFCNE9GWnJhVGRLWW5WMVRXMUdXWEpYVUdkWmIzbDBlV3RWV2pObGVYRm9kREZxT1V0aWJ6RTVNbWRpVW1aNFRERTNXVVJLUzNkdlpYVmFTa3AyTW01Tk9FMTVZbmx3WWpkUVVsTm5SRGRGUWpkNU1rRTFZbVZHWlZodlpuSnBSRXhhVFVaVVRGQlRiakpxU0ZnNU5FSXpkREoyU21GdFlUZzJUbVJWZFhwYVYxQmhkV3MzUlhsa2FYZGhTM1ZEYVdaWlJqVjBWblkyZURkRlpEaFhVMjFvWmpsT05HOU5kaU42TW1SdGVrUTRNV05uVUhnNFZtdHBOMHBpZFhWTmJVWlpjbGRRWjFsdmVYUjVhMVZhTTJWNWNXaDBNV281UzJKdk1Ua3laMkpTWm5oTU1UZFpSRXBMZDI5bGRWcEtTbll5YmswNFRYbGllWEJpTjFCU1UyZEVOMFZDTjNreVFUVmlaVVpsV0c5bWNtbEVURnBOUmxSTVVGTnVNbXBJV0RrMFFqTjBNblpLWVcxaE9EWk9aRlYxZWxwWFVHRjFhemRGZVdScGQyRkxkVU5wWmxsR05YUldkalo0TjBWa09GZFRiV2htT1U0MGIwMTJJbjAuZXlKMll5STZleUpBWTI5dWRHVjRkQ0k2V3lKb2RIUndjem92TDNkM2R5NTNNeTV2Y21jdk1qQXhPQzlqY21Wa1pXNTBhV0ZzY3k5Mk1TSXNJbWgwZEhCek9pOHZZWEJwTG5acFpHTm9ZV2x1TG01bGRDOWhjR2t2ZGpFdlkyOXVkR1Y0ZEhNdmRqRWlYU3dpZEhsd1pTSTZXeUpXWlhKcFptbGhZbXhsUTNKbFpHVnVkR2xoYkNJc0lrVnRZV2xzUTNKbFpHVnVkR2xoYkNKZExDSnBjM04xWlhJaU9uc2lhV1FpT2lKa2FXUTZhMlY1T25veVpHMTZSRGd4WTJkUWVEaFdhMmszU21KMWRVMXRSbGx5VjFCbldXOTVkSGxyVlZvelpYbHhhSFF4YWpsTFltOHhPVEpuWWxKbWVFd3hOMWxFU2t0M2IyVjFXa3BLZGpKdVRUaE5lV0o1Y0dJM1VGSlRaMFEzUlVJM2VUSkJOV0psUm1WWWIyWnlhVVJNV2sxR1ZFeFFVMjR5YWtoWU9UUkNNM1F5ZGtwaGJXRTROazVrVlhWNldsZFFZWFZyTjBWNVpHbDNZVXQxUTJsbVdVWTFkRloyTm5nM1JXUTRWMU50YUdZNVRqUnZUWFlpTENKdVlXMWxJam9pVm1Gc2FXUmhkR1ZrSUVsRUlGTk1JbjBzSW1sa0lqb2lkWEp1T25WMWFXUTZNVGcyTVRReE1tTXRPV1UyTXkwME5UVTVMV0kzTW1VdFpERTVNRFE1WkRJeE16aGhJaXdpWTNKbFpHVnVkR2xoYkZOMVltcGxZM1FpT25zaWFXUWlPaUprYVdRNmEyVjVPbm95WkcxNlJEZ3hZMmRRZURoV2EyazNTbUoxZFUxdFJsbHlWMUJuV1c5NWRIbHJWVm96WlhseGFIUXhhamxMWW5BM1kweGFURko0YzFwMVJWUnJPVUpPWnpOdlZtRlNWRVJSUTA0NGRWaGhlWGg1WlhRMVdtTnFaMXA0ZG5kdWRVMVlXVmRIZW5NM1RIaFlNWE0wUjFKaVRGVktkMFpLU0VaNlJXVk9la0p6TmxaM1N6aFRTbmxxY21sTGFrVTRObmhMUmxSRlFYZFdjemR4ZVZOSWEzSTRXak41YVcxb2MxTk1OMkpyWTAwM1RuUWlMQ0psYldGcGJDSTZJbUpsY201aGRDNXRZWEpqYVd4c1lVQjJZV3hwWkdGMFpXUnBaQzVqYjIwaWZTd2lZM0psWkdWdWRHbGhiRk4wWVhSMWN5STZleUowZVhCbElqb2lVbVYyYjJOaGRHbHZia3hwYzNReU1ESXhJaXdpYVdRaU9pSm9kSFJ3Y3pvdkwyUmxkaTUyYVdSamFHRnBiaTV1WlhRdllYQnBMM1l4TDNKbGRtOWpZWFJwYjI0dlkzSmxaR1Z1ZEdsaGJDMXpkR0YwZFhNdmMzUmhkSFZ6TFd4cGMzUXZNakkwTDJOeVpXUmxiblJwWVd3dk1qWWlMQ0p6ZEdGMGRYTk1hWE4wUTNKbFpHVnVkR2xoYkNJNkltaDBkSEJ6T2k4dlpHVjJMblpwWkdOb1lXbHVMbTVsZEM5aGNHa3ZkakV2Y21WMmIyTmhkR2x2Ymk5emRHRjBkWE10YkdsemRDOHlNalFpTENKemRHRjBkWE5NYVhOMFNXNWtaWGdpT2lJeU5pSjlmU3dpYVdGMElqb3hOekV4TXpZNU5qUTRMQ0pwYzNNaU9pSmthV1E2YTJWNU9ub3laRzE2UkRneFkyZFFlRGhXYTJrM1NtSjFkVTF0UmxseVYxQm5XVzk1ZEhsclZWb3paWGx4YUhReGFqbExZbTh4T1RKbllsSm1lRXd4TjFsRVNrdDNiMlYxV2twS2RqSnVUVGhOZVdKNWNHSTNVRkpUWjBRM1JVSTNlVEpCTldKbFJtVlliMlp5YVVSTVdrMUdWRXhRVTI0eWFraFlPVFJDTTNReWRrcGhiV0U0Tms1a1ZYVjZXbGRRWVhWck4wVjVaR2wzWVV0MVEybG1XVVkxZEZaMk5uZzNSV1E0VjFOdGFHWTVUalJ2VFhZaWZRLm4zeDRuZEtpb2F4MHcxSDMxU25oNGYyMnBtY0k1VDdjcDhfQU16R2lVSHlnTFV4bldYYW1HMDAtWGlTTk16QWUxWXFaOEs3aE5RMFp5SWJnbEFlVkJRIn0sImlzc3VhbmNlRGF0ZSI6IjIwMjQtMDMtMjVUMTI6Mjc6MjguMDAwWiIsImNyZWRlbnRpYWxTdGF0dXMiOnsidHlwZSI6IlJldm9jYXRpb25MaXN0MjAyMSIsImlkIjoiaHR0cHM6Ly9kZXYudmlkY2hhaW4ubmV0L2FwaS92MS9yZXZvY2F0aW9uL2NyZWRlbnRpYWwtc3RhdHVzL3N0YXR1cy1saXN0LzIyNC9jcmVkZW50aWFsLzI2Iiwic3RhdHVzTGlzdENyZWRlbnRpYWwiOiJodHRwczovL2Rldi52aWRjaGFpbi5uZXQvYXBpL3YxL3Jldm9jYXRpb24vc3RhdHVzLWxpc3QvMjI0Iiwic3RhdHVzTGlzdEluZGV4IjoiMjYifX1dfX0.2Md0_YH9dcMM5XdfnM4YVtKdLAntr0NSzV6DtzMkSjqq35JqNb18DjUpyigyme8wSUQP-JRD3UMEXlkL_W9GBQ',
            proofPurpose: 'authentication',
            type: 'Ed25519Signature2018',
            verificationMethod:
              'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt#z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt',
          },
          type: ['VerifiablePresentation'],
          verifiableCredential: [
            {
              '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://api.vidchain.net/api/v1/contexts/v1',
              ],
              credentialStatus: {
                id: 'https://dev.vidchain.net/api/v1/revocation/credential-status/status-list/224/credential/26',
                statusListCredential:
                  'https://dev.vidchain.net/api/v1/revocation/status-list/224',
                statusListIndex: '26',
                type: 'RevocationList2021',
              },
              credentialSubject: {
                email: 'bernat.marcilla@validatedid.com',
                id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbp7cLZLRxsZuETk9BNg3oVaRTDQCN8uXayxyet5ZcjgZxvwnuMXYWGzs7LxX1s4GRbLUJwFJHFzEeNzBs6VwK8SJyjriKjE86xKFTEAwVs7qySHkr8Z3yimhsSL7bkcM7Nt',
              },
              id: 'urn:uuid:1861412c-9e63-4559-b72e-d19049d2138a',
              issuanceDate: '2024-03-25T12:27:28.000Z',
              issuer: {
                id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbo192gbRfxL17YDJKwoeuZJJv2nM8Mybypb7PRSgD7EB7y2A5beFeXofriDLZMFTLPSn2jHX94B3t2vJama86NdUuzZWPauk7EydiwaKuCifYF5tVv6x7Ed8WSmhf9N4oMv',
                name: 'Validated ID SL',
              },
              proof: {
                created: '2024-03-25T12:27:28.000Z',
                jws: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtibzE5MmdiUmZ4TDE3WURKS3dvZXVaSkp2Mm5NOE15YnlwYjdQUlNnRDdFQjd5MkE1YmVGZVhvZnJpRExaTUZUTFBTbjJqSFg5NEIzdDJ2SmFtYTg2TmRVdXpaV1BhdWs3RXlkaXdhS3VDaWZZRjV0VnY2eDdFZDhXU21oZjlONG9NdiN6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JvMTkyZ2JSZnhMMTdZREpLd29ldVpKSnYybk04TXlieXBiN1BSU2dEN0VCN3kyQTViZUZlWG9mcmlETFpNRlRMUFNuMmpIWDk0QjN0MnZKYW1hODZOZFV1elpXUGF1azdFeWRpd2FLdUNpZllGNXRWdjZ4N0VkOFdTbWhmOU40b012In0.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsImh0dHBzOi8vYXBpLnZpZGNoYWluLm5ldC9hcGkvdjEvY29udGV4dHMvdjEiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIkVtYWlsQ3JlZGVudGlhbCJdLCJpc3N1ZXIiOnsiaWQiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYm8xOTJnYlJmeEwxN1lESkt3b2V1WkpKdjJuTThNeWJ5cGI3UFJTZ0Q3RUI3eTJBNWJlRmVYb2ZyaURMWk1GVExQU24yakhYOTRCM3QydkphbWE4Nk5kVXV6WldQYXVrN0V5ZGl3YUt1Q2lmWUY1dFZ2Nng3RWQ4V1NtaGY5TjRvTXYiLCJuYW1lIjoiVmFsaWRhdGVkIElEIFNMIn0sImlkIjoidXJuOnV1aWQ6MTg2MTQxMmMtOWU2My00NTU5LWI3MmUtZDE5MDQ5ZDIxMzhhIiwiY3JlZGVudGlhbFN1YmplY3QiOnsiaWQiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnA3Y0xaTFJ4c1p1RVRrOUJOZzNvVmFSVERRQ044dVhheXh5ZXQ1WmNqZ1p4dndudU1YWVdHenM3THhYMXM0R1JiTFVKd0ZKSEZ6RWVOekJzNlZ3SzhTSnlqcmlLakU4NnhLRlRFQXdWczdxeVNIa3I4WjN5aW1oc1NMN2JrY003TnQiLCJlbWFpbCI6ImJlcm5hdC5tYXJjaWxsYUB2YWxpZGF0ZWRpZC5jb20ifSwiY3JlZGVudGlhbFN0YXR1cyI6eyJ0eXBlIjoiUmV2b2NhdGlvbkxpc3QyMDIxIiwiaWQiOiJodHRwczovL2Rldi52aWRjaGFpbi5uZXQvYXBpL3YxL3Jldm9jYXRpb24vY3JlZGVudGlhbC1zdGF0dXMvc3RhdHVzLWxpc3QvMjI0L2NyZWRlbnRpYWwvMjYiLCJzdGF0dXNMaXN0Q3JlZGVudGlhbCI6Imh0dHBzOi8vZGV2LnZpZGNoYWluLm5ldC9hcGkvdjEvcmV2b2NhdGlvbi9zdGF0dXMtbGlzdC8yMjQiLCJzdGF0dXNMaXN0SW5kZXgiOiIyNiJ9fSwiaWF0IjoxNzExMzY5NjQ4LCJpc3MiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYm8xOTJnYlJmeEwxN1lESkt3b2V1WkpKdjJuTThNeWJ5cGI3UFJTZ0Q3RUI3eTJBNWJlRmVYb2ZyaURMWk1GVExQU24yakhYOTRCM3QydkphbWE4Nk5kVXV6WldQYXVrN0V5ZGl3YUt1Q2lmWUY1dFZ2Nng3RWQ4V1NtaGY5TjRvTXYifQ.n3x4ndKioax0w1H31Snh4f22pmcI5T7cp8_AMzGiUHygLUxnWXamG00-XiSNMzAe1YqZ8K7hNQ0ZyIbglAeVBQ',
                proofPurpose: 'assertionMethod',
                type: 'JsonWebSignature2020',
                verificationMethod:
                  'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbo192gbRfxL17YDJKwoeuZJJv2nM8Mybypb7PRSgD7EB7y2A5beFeXofriDLZMFTLPSn2jHX94B3t2vJama86NdUuzZWPauk7EydiwaKuCifYF5tVv6x7Ed8WSmhf9N4oMv#z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9Kbo192gbRfxL17YDJKwoeuZJJv2nM8Mybypb7PRSgD7EB7y2A5beFeXofriDLZMFTLPSn2jHX94B3t2vJama86NdUuzZWPauk7EydiwaKuCifYF5tVv6x7Ed8WSmhf9N4oMv',
              },
              type: ['VerifiableCredential', 'EmailCredential'],
            },
          ],
        },
      },
    });
  });

  it('return the list of credentials from vp_token, input: vp_token as string[]', () => {
    const vpToken = [
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciJ9.eyJpc3MiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJhdWQiOiJodHRwczovL215LnZlcmlmaWVyLmNvbS9jbGllbnRfaWQiLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJpYXQiOjE1ODk2OTkyNjAsIm5iZiI6MTU4OTY5OTI2MCwiZXhwIjoxNTg5Njk5MjYwLCJub25jZSI6IkZna2VFcmY5MWtmbCIsImp0aSI6InVybjp1dWlkOjA3MDYwNjFhLWUyY2EtNDYxNC05ZGU3LTljMTQ1MTkzNWYwMiIsInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sImlkIjoidXJuOnV1aWQ6MDcwNjA2MWEtZTJjYS00NjE0LTlkZTctOWMxNDUxOTM1ZjAyIiwidHlwZSI6WyJWZXJpZmlhYmxlUHJlc2VudGF0aW9uIl0sImhvbGRlciI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsInZlcmlmaWFibGVDcmVkZW50aWFsIjpbImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSkZVekkxTmlJc0ltdHBaQ0k2SW1ScFpEcGxZbk5wT25wMlNGZFlNelU1UVRORGRtWktia05aWVVGcFFXUmxJMFl3Y2pWUGVYUmZiR0ZvZG5aNk5rMVhiRmx6TTIxaldVNUxXbWxwVVdSVlpuRjJPSFJ6YUVoT09YY2lmUS5leUpwYzNNaU9pSmthV1E2WldKemFUcDZka2hYV0RNMU9VRXpRM1ptU201RFdXRkJhVUZrWlNJc0luTjFZaUk2SW1ScFpEcHJaWGs2ZWpKa2JYcEVPREZqWjFCNE9GWnJhVGRLWW5WMVRXMUdXWEpYVUdkWmIzbDBlV3RWV2pObGVYRm9kREZxT1V0aWMwVlpkbVJ5YW5oTmFsRTBkSEJ1YW1VNVFrUkNWSHAxVGtSUU0ydHVialp4VEZwRmNucGtOR0pLTldkdk1rTkRhRzlRYW1RMVIwRklNM3B3UmtwUU5XWjFkMU5yTmpaVk5WQnhOa1ZvUmpSdVMyNUlla1J1ZW01RlVEaG1XRGs1YmxwSFozZGlRV2d4YnpkSGFqRllOVEpVWkdobU4xVTBTMVJyTmpaNGMwRTFjaUlzSW1saGRDSTZNVFU0T1RZNU9USTJNQ3dpYm1KbUlqb3hOVGc1TmprNU1qWXdMQ0psZUhBaU9qRTFPRGsyT1RreU5qQXNJbXAwYVNJNkluVnlianAxZFdsa1lqWTVNVFpqTVRBdE9HSTJOQzAwTkRJNExUaGlaalV0WTJSbU5EZ3pPRE16TVRCaklpd2lkbU1pT25zaVFHTnZiblJsZUhRaU9sc2lhSFIwY0hNNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TVRndlkzSmxaR1Z1ZEdsaGJITXZkakVpWFN3aWFXUWlPaUoxY200NmRYVnBaRHBpTmpreE5tTXhNQzA0WWpZMExUUTBNamd0T0dKbU5TMWpaR1kwT0RNNE16TXhNR01pTENKMGVYQmxJanBiSWxabGNtbG1hV0ZpYkdWRGNtVmtaVzUwYVdGc0lpd2lWbVZ5YVdacFlXSnNaVUYwZEdWemRHRjBhVzl1SWwwc0ltbHpjM1ZsY2lJNkltUnBaRHBsWW5OcE9ucDJTRmRZTXpVNVFUTkRkbVpLYmtOWllVRnBRV1JsSWl3aWFYTnpkV0Z1WTJWRVlYUmxJam9pTWpBeU1DMHdOUzB4TjFRd056b3dOem8wTUZvaUxDSjJZV3hwWkVaeWIyMGlPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0luWmhiR2xrVlc1MGFXd2lPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0ltVjRjR2x5WVhScGIyNUVZWFJsSWpvaU1qQXlNQzB3TlMweE4xUXdOem93TnpvME1Gb2lMQ0pwYzNOMVpXUWlPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0ltTnlaV1JsYm5ScFlXeFRkV0pxWldOMElqcDdJbWxrSWpvaVpHbGtPbXRsZVRwNk1tUnRla1E0TVdOblVIZzRWbXRwTjBwaWRYVk5iVVpaY2xkUVoxbHZlWFI1YTFWYU0yVjVjV2gwTVdvNVMySnpSVmwyWkhKcWVFMXFVVFIwY0c1cVpUbENSRUpVZW5WT1JGQXphMjV1Tm5GTVdrVnllbVEwWWtvMVoyOHlRME5vYjFCcVpEVkhRVWd6ZW5CR1NsQTFablYzVTJzMk5sVTFVSEUyUldoR05HNUxia2g2Ukc1NmJrVlFPR1pZT1RsdVdrZG5kMkpCYURGdk4wZHFNVmcxTWxSa2FHWTNWVFJMVkdzMk5uaHpRVFZ5SW4wc0ltTnlaV1JsYm5ScFlXeFRZMmhsYldFaU9uc2lhV1FpT2lKb2RIUndjem92TDJGd2FTMXdhV3h2ZEM1bFluTnBMbVYxTDNSeWRYTjBaV1F0YzJOb1pXMWhjeTF5WldkcGMzUnllUzkyTWk5elkyaGxiV0Z6THpCNE1qTXdNemxsTmpNMU5tVmhObUkzTUROalpUWTNNbVUzWTJaaFl6QmlOREkzTmpWaU1UVXdaall6WkdZM09HVXlZbVF4T0dGbE56ZzFOemczWmpaaE1pSXNJblI1Y0dVaU9pSkdkV3hzU25OdmJsTmphR1Z0WVZaaGJHbGtZWFJ2Y2pJd01qRWlmWDE5LkVHc0UxWVhDX1pySkRCY2NxdGFmeUotaG15NnlRcTl5bm5ZTGctcHBQNWRHbkJNdXNMemdaYlNYcmF3TkQ2MWtBRXMwakNjX2NCYjluc0gyR3ZlTXd3IiwiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKRlV6STFOaUlzSW10cFpDSTZJbVJwWkRwbFluTnBPbnAyU0ZkWU16VTVRVE5EZG1aS2JrTlpZVUZwUVdSbEkwWXdjalZQZVhSZmJHRm9kblo2TmsxWGJGbHpNMjFqV1U1TFdtbHBVV1JWWm5GMk9IUnphRWhPT1hjaWZRLmV5SnBjM01pT2lKa2FXUTZaV0p6YVRwNmRraFhXRE0xT1VFelEzWm1TbTVEV1dGQmFVRmtaU0lzSW5OMVlpSTZJbVJwWkRwclpYazZlakprYlhwRU9ERmpaMUI0T0ZacmFUZEtZblYxVFcxR1dYSlhVR2RaYjNsMGVXdFZXak5sZVhGb2RERnFPVXRpYzBWWmRtUnlhbmhOYWxFMGRIQnVhbVU1UWtSQ1ZIcDFUa1JRTTJ0dWJqWnhURnBGY25wa05HSktOV2R2TWtORGFHOVFhbVExUjBGSU0zcHdSa3BRTldaMWQxTnJOalpWTlZCeE5rVm9SalJ1UzI1SWVrUnVlbTVGVURobVdEazVibHBIWjNkaVFXZ3hiemRIYWpGWU5USlVaR2htTjFVMFMxUnJOalo0YzBFMWNpSXNJbWxoZENJNk1UVTRPVFk1T1RJMk1Dd2libUptSWpveE5UZzVOams1TWpZd0xDSmxlSEFpT2pFMU9EazJPVGt5TmpBc0ltcDBhU0k2SW5WeWJqcDFkV2xrWW1KbU16a3lNV1l0TnpCbU1TMDBZakEyTFRnMk56QXRZbVkwWkRWa1kyWmpZVFl6SWl3aWRtTWlPbnNpUUdOdmJuUmxlSFFpT2xzaWFIUjBjSE02THk5M2QzY3Vkek11YjNKbkx6SXdNVGd2WTNKbFpHVnVkR2xoYkhNdmRqRWlYU3dpYVdRaU9pSjFjbTQ2ZFhWcFpEcGlZbVl6T1RJeFppMDNNR1l4TFRSaU1EWXRPRFkzTUMxaVpqUmtOV1JqWm1OaE5qTWlMQ0owZVhCbElqcGJJbFpsY21sbWFXRmliR1ZEY21Wa1pXNTBhV0ZzSWl3aVZtVnlhV1pwWVdKc1pVRjBkR1Z6ZEdGMGFXOXVJbDBzSW1semMzVmxjaUk2SW1ScFpEcGxZbk5wT25wMlNGZFlNelU1UVRORGRtWktia05aWVVGcFFXUmxJaXdpYVhOemRXRnVZMlZFWVhSbElqb2lNakF5TUMwd05TMHhOMVF3Tnpvd056bzBNRm9pTENKMllXeHBaRVp5YjIwaU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW5aaGJHbGtWVzUwYVd3aU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW1WNGNHbHlZWFJwYjI1RVlYUmxJam9pTWpBeU1DMHdOUzB4TjFRd056b3dOem8wTUZvaUxDSnBjM04xWldRaU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW1OeVpXUmxiblJwWVd4VGRXSnFaV04wSWpwN0ltbGtJam9pWkdsa09tdGxlVHA2TW1SdGVrUTRNV05uVUhnNFZtdHBOMHBpZFhWTmJVWlpjbGRRWjFsdmVYUjVhMVZhTTJWNWNXaDBNV281UzJKelJWbDJaSEpxZUUxcVVUUjBjRzVxWlRsQ1JFSlVlblZPUkZBemEyNXVObkZNV2tWeWVtUTBZa28xWjI4eVEwTm9iMUJxWkRWSFFVZ3plbkJHU2xBMVpuVjNVMnMyTmxVMVVIRTJSV2hHTkc1TGJraDZSRzU2YmtWUU9HWllPVGx1V2tkbmQySkJhREZ2TjBkcU1WZzFNbFJrYUdZM1ZUUkxWR3MyTm5oelFUVnlJbjBzSW1OeVpXUmxiblJwWVd4VFkyaGxiV0VpT25zaWFXUWlPaUpvZEhSd2N6b3ZMMkZ3YVMxd2FXeHZkQzVsWW5OcExtVjFMM1J5ZFhOMFpXUXRjMk5vWlcxaGN5MXlaV2RwYzNSeWVTOTJNaTl6WTJobGJXRnpMekI0TWpNd016bGxOak0xTm1WaE5tSTNNRE5qWlRZM01tVTNZMlpoWXpCaU5ESTNOalZpTVRVd1pqWXpaR1kzT0dVeVltUXhPR0ZsTnpnMU56ZzNaalpoTWlJc0luUjVjR1VpT2lKR2RXeHNTbk52YmxOamFHVnRZVlpoYkdsa1lYUnZjakl3TWpFaWZYMTkuc3VyWElVLWo2T0lTU2p3UjlnbTVIVnJ3VmlKWXRTZENFaEp5ZV9kNm1Ib0NJbk1Fb1d4akg0NUl4dEVIREllTTNJcnJXOGIyZjRTei1DZUJlSXdOb3ciLCJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNkltUnBaRHBsWW5OcE9ucDJTRmRZTXpVNVFUTkRkbVpLYmtOWllVRnBRV1JsSTBZd2NqVlBlWFJmYkdGb2RuWjZOazFYYkZsek0yMWpXVTVMV21scFVXUlZabkYyT0hSemFFaE9PWGNpZlEuZXlKcGMzTWlPaUprYVdRNlpXSnphVHA2ZGtoWFdETTFPVUV6UTNabVNtNURXV0ZCYVVGa1pTSXNJbk4xWWlJNkltUnBaRHByWlhrNmVqSmtiWHBFT0RGaloxQjRPRlpyYVRkS1luVjFUVzFHV1hKWFVHZFpiM2wwZVd0VldqTmxlWEZvZERGcU9VdGljMFZaZG1SeWFuaE5hbEUwZEhCdWFtVTVRa1JDVkhwMVRrUlFNMnR1YmpaeFRGcEZjbnBrTkdKS05XZHZNa05EYUc5UWFtUTFSMEZJTTNwd1JrcFFOV1oxZDFOck5qWlZOVkJ4TmtWb1JqUnVTMjVJZWtSdWVtNUZVRGhtV0RrNWJscEhaM2RpUVdneGJ6ZEhhakZZTlRKVVpHaG1OMVUwUzFSck5qWjRjMEUxY2lJc0ltbGhkQ0k2TVRVNE9UWTVPVEkyTUN3aWJtSm1Jam94TlRnNU5qazVNall3TENKbGVIQWlPakUxT0RrMk9Ua3lOakFzSW1wMGFTSTZJblZ5YmpwMWRXbGtZVFJrWVdKaE5XVXRaR1ppTUMwMFpqQmlMVGc0TlRVdE1XTTBaRGszWldJeU5HRXlJaXdpZG1NaU9uc2lRR052Ym5SbGVIUWlPbHNpYUhSMGNITTZMeTkzZDNjdWR6TXViM0puTHpJd01UZ3ZZM0psWkdWdWRHbGhiSE12ZGpFaVhTd2lhV1FpT2lKMWNtNDZkWFZwWkRwaE5HUmhZbUUxWlMxa1ptSXdMVFJtTUdJdE9EZzFOUzB4WXpSa09UZGxZakkwWVRJaUxDSjBlWEJsSWpwYklsWmxjbWxtYVdGaWJHVkRjbVZrWlc1MGFXRnNJaXdpVm1WeWFXWnBZV0pzWlVGMGRHVnpkR0YwYVc5dUlsMHNJbWx6YzNWbGNpSTZJbVJwWkRwbFluTnBPbnAyU0ZkWU16VTVRVE5EZG1aS2JrTlpZVUZwUVdSbElpd2lhWE56ZFdGdVkyVkVZWFJsSWpvaU1qQXlNQzB3TlMweE4xUXdOem93TnpvME1Gb2lMQ0oyWVd4cFpFWnliMjBpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJblpoYkdsa1ZXNTBhV3dpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJbVY0Y0dseVlYUnBiMjVFWVhSbElqb2lNakF5TUMwd05TMHhOMVF3Tnpvd056bzBNRm9pTENKcGMzTjFaV1FpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJbU55WldSbGJuUnBZV3hUZFdKcVpXTjBJanA3SW1sa0lqb2laR2xrT210bGVUcDZNbVJ0ZWtRNE1XTm5VSGc0Vm10cE4wcGlkWFZOYlVaWmNsZFFaMWx2ZVhSNWExVmFNMlY1Y1doME1XbzVTMkp6UlZsMlpISnFlRTFxVVRSMGNHNXFaVGxDUkVKVWVuVk9SRkF6YTI1dU5uRk1Xa1Z5ZW1RMFlrbzFaMjh5UTBOb2IxQnFaRFZIUVVnemVuQkdTbEExWm5WM1UyczJObFUxVUhFMlJXaEdORzVMYmtoNlJHNTZia1ZRT0daWU9UbHVXa2RuZDJKQmFERnZOMGRxTVZnMU1sUmthR1kzVlRSTFZHczJObmh6UVRWeUluMHNJbU55WldSbGJuUnBZV3hUWTJobGJXRWlPbnNpYVdRaU9pSm9kSFJ3Y3pvdkwyRndhUzF3YVd4dmRDNWxZbk5wTG1WMUwzUnlkWE4wWldRdGMyTm9aVzFoY3kxeVpXZHBjM1J5ZVM5Mk1pOXpZMmhsYldGekx6QjRNak13TXpsbE5qTTFObVZoTm1JM01ETmpaVFkzTW1VM1kyWmhZekJpTkRJM05qVmlNVFV3WmpZelpHWTNPR1V5WW1ReE9HRmxOemcxTnpnM1pqWmhNaUlzSW5SNWNHVWlPaUpHZFd4c1NuTnZibE5qYUdWdFlWWmhiR2xrWVhSdmNqSXdNakVpZlgxOS5QSUNDWldCNnA1elFveFZKT2Z0MXlRU09Gb1RncFM4cVdUUDNDdGdRN0hCSFN0VFNuVEllbGpncVBaaXZHbHNhOVItQW5aZlNtcGxwaTF3X21fZVlRUSJdfX0.HBfJM7yaYgz0Lm93fGFKnQb56r5DUIRZ_lSWaRFdPspzeI4sD0vTh2r2sSj7f3VjiJLPCc0eZivRuq28YmyUOA',
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciJ9.eyJpc3MiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJhdWQiOiJodHRwczovL215LnZlcmlmaWVyLmNvbS9jbGllbnRfaWQiLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJpYXQiOjE1ODk2OTkyNjAsIm5iZiI6MTU4OTY5OTI2MCwiZXhwIjoxNTg5Njk5MjYwLCJub25jZSI6IkZna2VFcmY5MWtmbCIsImp0aSI6InVybjp1dWlkOjA3MDYwNjFhLWUyY2EtNDYxNC05ZGU3LTljMTQ1MTkzNWYwMiIsInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sImlkIjoidXJuOnV1aWQ6MDcwNjA2MWEtZTJjYS00NjE0LTlkZTctOWMxNDUxOTM1ZjAyIiwidHlwZSI6WyJWZXJpZmlhYmxlUHJlc2VudGF0aW9uIl0sImhvbGRlciI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsInZlcmlmaWFibGVDcmVkZW50aWFsIjpbImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSkZVekkxTmlJc0ltdHBaQ0k2SW1ScFpEcGxZbk5wT25wMlNGZFlNelU1UVRORGRtWktia05aWVVGcFFXUmxJMFl3Y2pWUGVYUmZiR0ZvZG5aNk5rMVhiRmx6TTIxaldVNUxXbWxwVVdSVlpuRjJPSFJ6YUVoT09YY2lmUS5leUpwYzNNaU9pSmthV1E2WldKemFUcDZka2hYV0RNMU9VRXpRM1ptU201RFdXRkJhVUZrWlNJc0luTjFZaUk2SW1ScFpEcHJaWGs2ZWpKa2JYcEVPREZqWjFCNE9GWnJhVGRLWW5WMVRXMUdXWEpYVUdkWmIzbDBlV3RWV2pObGVYRm9kREZxT1V0aWMwVlpkbVJ5YW5oTmFsRTBkSEJ1YW1VNVFrUkNWSHAxVGtSUU0ydHVialp4VEZwRmNucGtOR0pLTldkdk1rTkRhRzlRYW1RMVIwRklNM3B3UmtwUU5XWjFkMU5yTmpaVk5WQnhOa1ZvUmpSdVMyNUlla1J1ZW01RlVEaG1XRGs1YmxwSFozZGlRV2d4YnpkSGFqRllOVEpVWkdobU4xVTBTMVJyTmpaNGMwRTFjaUlzSW1saGRDSTZNVFU0T1RZNU9USTJNQ3dpYm1KbUlqb3hOVGc1TmprNU1qWXdMQ0psZUhBaU9qRTFPRGsyT1RreU5qQXNJbXAwYVNJNkluVnlianAxZFdsa1lqWTVNVFpqTVRBdE9HSTJOQzAwTkRJNExUaGlaalV0WTJSbU5EZ3pPRE16TVRCaklpd2lkbU1pT25zaVFHTnZiblJsZUhRaU9sc2lhSFIwY0hNNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TVRndlkzSmxaR1Z1ZEdsaGJITXZkakVpWFN3aWFXUWlPaUoxY200NmRYVnBaRHBpTmpreE5tTXhNQzA0WWpZMExUUTBNamd0T0dKbU5TMWpaR1kwT0RNNE16TXhNR01pTENKMGVYQmxJanBiSWxabGNtbG1hV0ZpYkdWRGNtVmtaVzUwYVdGc0lpd2lWbVZ5YVdacFlXSnNaVUYwZEdWemRHRjBhVzl1SWwwc0ltbHpjM1ZsY2lJNkltUnBaRHBsWW5OcE9ucDJTRmRZTXpVNVFUTkRkbVpLYmtOWllVRnBRV1JsSWl3aWFYTnpkV0Z1WTJWRVlYUmxJam9pTWpBeU1DMHdOUzB4TjFRd056b3dOem8wTUZvaUxDSjJZV3hwWkVaeWIyMGlPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0luWmhiR2xrVlc1MGFXd2lPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0ltVjRjR2x5WVhScGIyNUVZWFJsSWpvaU1qQXlNQzB3TlMweE4xUXdOem93TnpvME1Gb2lMQ0pwYzNOMVpXUWlPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0ltTnlaV1JsYm5ScFlXeFRkV0pxWldOMElqcDdJbWxrSWpvaVpHbGtPbXRsZVRwNk1tUnRla1E0TVdOblVIZzRWbXRwTjBwaWRYVk5iVVpaY2xkUVoxbHZlWFI1YTFWYU0yVjVjV2gwTVdvNVMySnpSVmwyWkhKcWVFMXFVVFIwY0c1cVpUbENSRUpVZW5WT1JGQXphMjV1Tm5GTVdrVnllbVEwWWtvMVoyOHlRME5vYjFCcVpEVkhRVWd6ZW5CR1NsQTFablYzVTJzMk5sVTFVSEUyUldoR05HNUxia2g2Ukc1NmJrVlFPR1pZT1RsdVdrZG5kMkpCYURGdk4wZHFNVmcxTWxSa2FHWTNWVFJMVkdzMk5uaHpRVFZ5SW4wc0ltTnlaV1JsYm5ScFlXeFRZMmhsYldFaU9uc2lhV1FpT2lKb2RIUndjem92TDJGd2FTMXdhV3h2ZEM1bFluTnBMbVYxTDNSeWRYTjBaV1F0YzJOb1pXMWhjeTF5WldkcGMzUnllUzkyTWk5elkyaGxiV0Z6THpCNE1qTXdNemxsTmpNMU5tVmhObUkzTUROalpUWTNNbVUzWTJaaFl6QmlOREkzTmpWaU1UVXdaall6WkdZM09HVXlZbVF4T0dGbE56ZzFOemczWmpaaE1pSXNJblI1Y0dVaU9pSkdkV3hzU25OdmJsTmphR1Z0WVZaaGJHbGtZWFJ2Y2pJd01qRWlmWDE5LkVHc0UxWVhDX1pySkRCY2NxdGFmeUotaG15NnlRcTl5bm5ZTGctcHBQNWRHbkJNdXNMemdaYlNYcmF3TkQ2MWtBRXMwakNjX2NCYjluc0gyR3ZlTXd3IiwiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKRlV6STFOaUlzSW10cFpDSTZJbVJwWkRwbFluTnBPbnAyU0ZkWU16VTVRVE5EZG1aS2JrTlpZVUZwUVdSbEkwWXdjalZQZVhSZmJHRm9kblo2TmsxWGJGbHpNMjFqV1U1TFdtbHBVV1JWWm5GMk9IUnphRWhPT1hjaWZRLmV5SnBjM01pT2lKa2FXUTZaV0p6YVRwNmRraFhXRE0xT1VFelEzWm1TbTVEV1dGQmFVRmtaU0lzSW5OMVlpSTZJbVJwWkRwclpYazZlakprYlhwRU9ERmpaMUI0T0ZacmFUZEtZblYxVFcxR1dYSlhVR2RaYjNsMGVXdFZXak5sZVhGb2RERnFPVXRpYzBWWmRtUnlhbmhOYWxFMGRIQnVhbVU1UWtSQ1ZIcDFUa1JRTTJ0dWJqWnhURnBGY25wa05HSktOV2R2TWtORGFHOVFhbVExUjBGSU0zcHdSa3BRTldaMWQxTnJOalpWTlZCeE5rVm9SalJ1UzI1SWVrUnVlbTVGVURobVdEazVibHBIWjNkaVFXZ3hiemRIYWpGWU5USlVaR2htTjFVMFMxUnJOalo0YzBFMWNpSXNJbWxoZENJNk1UVTRPVFk1T1RJMk1Dd2libUptSWpveE5UZzVOams1TWpZd0xDSmxlSEFpT2pFMU9EazJPVGt5TmpBc0ltcDBhU0k2SW5WeWJqcDFkV2xrWW1KbU16a3lNV1l0TnpCbU1TMDBZakEyTFRnMk56QXRZbVkwWkRWa1kyWmpZVFl6SWl3aWRtTWlPbnNpUUdOdmJuUmxlSFFpT2xzaWFIUjBjSE02THk5M2QzY3Vkek11YjNKbkx6SXdNVGd2WTNKbFpHVnVkR2xoYkhNdmRqRWlYU3dpYVdRaU9pSjFjbTQ2ZFhWcFpEcGlZbVl6T1RJeFppMDNNR1l4TFRSaU1EWXRPRFkzTUMxaVpqUmtOV1JqWm1OaE5qTWlMQ0owZVhCbElqcGJJbFpsY21sbWFXRmliR1ZEY21Wa1pXNTBhV0ZzSWl3aVZtVnlhV1pwWVdKc1pVRjBkR1Z6ZEdGMGFXOXVJbDBzSW1semMzVmxjaUk2SW1ScFpEcGxZbk5wT25wMlNGZFlNelU1UVRORGRtWktia05aWVVGcFFXUmxJaXdpYVhOemRXRnVZMlZFWVhSbElqb2lNakF5TUMwd05TMHhOMVF3Tnpvd056bzBNRm9pTENKMllXeHBaRVp5YjIwaU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW5aaGJHbGtWVzUwYVd3aU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW1WNGNHbHlZWFJwYjI1RVlYUmxJam9pTWpBeU1DMHdOUzB4TjFRd056b3dOem8wTUZvaUxDSnBjM04xWldRaU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW1OeVpXUmxiblJwWVd4VGRXSnFaV04wSWpwN0ltbGtJam9pWkdsa09tdGxlVHA2TW1SdGVrUTRNV05uVUhnNFZtdHBOMHBpZFhWTmJVWlpjbGRRWjFsdmVYUjVhMVZhTTJWNWNXaDBNV281UzJKelJWbDJaSEpxZUUxcVVUUjBjRzVxWlRsQ1JFSlVlblZPUkZBemEyNXVObkZNV2tWeWVtUTBZa28xWjI4eVEwTm9iMUJxWkRWSFFVZ3plbkJHU2xBMVpuVjNVMnMyTmxVMVVIRTJSV2hHTkc1TGJraDZSRzU2YmtWUU9HWllPVGx1V2tkbmQySkJhREZ2TjBkcU1WZzFNbFJrYUdZM1ZUUkxWR3MyTm5oelFUVnlJbjBzSW1OeVpXUmxiblJwWVd4VFkyaGxiV0VpT25zaWFXUWlPaUpvZEhSd2N6b3ZMMkZ3YVMxd2FXeHZkQzVsWW5OcExtVjFMM1J5ZFhOMFpXUXRjMk5vWlcxaGN5MXlaV2RwYzNSeWVTOTJNaTl6WTJobGJXRnpMekI0TWpNd016bGxOak0xTm1WaE5tSTNNRE5qWlRZM01tVTNZMlpoWXpCaU5ESTNOalZpTVRVd1pqWXpaR1kzT0dVeVltUXhPR0ZsTnpnMU56ZzNaalpoTWlJc0luUjVjR1VpT2lKR2RXeHNTbk52YmxOamFHVnRZVlpoYkdsa1lYUnZjakl3TWpFaWZYMTkuc3VyWElVLWo2T0lTU2p3UjlnbTVIVnJ3VmlKWXRTZENFaEp5ZV9kNm1Ib0NJbk1Fb1d4akg0NUl4dEVIREllTTNJcnJXOGIyZjRTei1DZUJlSXdOb3ciLCJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNkltUnBaRHBsWW5OcE9ucDJTRmRZTXpVNVFUTkRkbVpLYmtOWllVRnBRV1JsSTBZd2NqVlBlWFJmYkdGb2RuWjZOazFYYkZsek0yMWpXVTVMV21scFVXUlZabkYyT0hSemFFaE9PWGNpZlEuZXlKcGMzTWlPaUprYVdRNlpXSnphVHA2ZGtoWFdETTFPVUV6UTNabVNtNURXV0ZCYVVGa1pTSXNJbk4xWWlJNkltUnBaRHByWlhrNmVqSmtiWHBFT0RGaloxQjRPRlpyYVRkS1luVjFUVzFHV1hKWFVHZFpiM2wwZVd0VldqTmxlWEZvZERGcU9VdGljMFZaZG1SeWFuaE5hbEUwZEhCdWFtVTVRa1JDVkhwMVRrUlFNMnR1YmpaeFRGcEZjbnBrTkdKS05XZHZNa05EYUc5UWFtUTFSMEZJTTNwd1JrcFFOV1oxZDFOck5qWlZOVkJ4TmtWb1JqUnVTMjVJZWtSdWVtNUZVRGhtV0RrNWJscEhaM2RpUVdneGJ6ZEhhakZZTlRKVVpHaG1OMVUwUzFSck5qWjRjMEUxY2lJc0ltbGhkQ0k2TVRVNE9UWTVPVEkyTUN3aWJtSm1Jam94TlRnNU5qazVNall3TENKbGVIQWlPakUxT0RrMk9Ua3lOakFzSW1wMGFTSTZJblZ5YmpwMWRXbGtZVFJrWVdKaE5XVXRaR1ppTUMwMFpqQmlMVGc0TlRVdE1XTTBaRGszWldJeU5HRXlJaXdpZG1NaU9uc2lRR052Ym5SbGVIUWlPbHNpYUhSMGNITTZMeTkzZDNjdWR6TXViM0puTHpJd01UZ3ZZM0psWkdWdWRHbGhiSE12ZGpFaVhTd2lhV1FpT2lKMWNtNDZkWFZwWkRwaE5HUmhZbUUxWlMxa1ptSXdMVFJtTUdJdE9EZzFOUzB4WXpSa09UZGxZakkwWVRJaUxDSjBlWEJsSWpwYklsWmxjbWxtYVdGaWJHVkRjbVZrWlc1MGFXRnNJaXdpVm1WeWFXWnBZV0pzWlVGMGRHVnpkR0YwYVc5dUlsMHNJbWx6YzNWbGNpSTZJbVJwWkRwbFluTnBPbnAyU0ZkWU16VTVRVE5EZG1aS2JrTlpZVUZwUVdSbElpd2lhWE56ZFdGdVkyVkVZWFJsSWpvaU1qQXlNQzB3TlMweE4xUXdOem93TnpvME1Gb2lMQ0oyWVd4cFpFWnliMjBpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJblpoYkdsa1ZXNTBhV3dpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJbVY0Y0dseVlYUnBiMjVFWVhSbElqb2lNakF5TUMwd05TMHhOMVF3Tnpvd056bzBNRm9pTENKcGMzTjFaV1FpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJbU55WldSbGJuUnBZV3hUZFdKcVpXTjBJanA3SW1sa0lqb2laR2xrT210bGVUcDZNbVJ0ZWtRNE1XTm5VSGc0Vm10cE4wcGlkWFZOYlVaWmNsZFFaMWx2ZVhSNWExVmFNMlY1Y1doME1XbzVTMkp6UlZsMlpISnFlRTFxVVRSMGNHNXFaVGxDUkVKVWVuVk9SRkF6YTI1dU5uRk1Xa1Z5ZW1RMFlrbzFaMjh5UTBOb2IxQnFaRFZIUVVnemVuQkdTbEExWm5WM1UyczJObFUxVUhFMlJXaEdORzVMYmtoNlJHNTZia1ZRT0daWU9UbHVXa2RuZDJKQmFERnZOMGRxTVZnMU1sUmthR1kzVlRSTFZHczJObmh6UVRWeUluMHNJbU55WldSbGJuUnBZV3hUWTJobGJXRWlPbnNpYVdRaU9pSm9kSFJ3Y3pvdkwyRndhUzF3YVd4dmRDNWxZbk5wTG1WMUwzUnlkWE4wWldRdGMyTm9aVzFoY3kxeVpXZHBjM1J5ZVM5Mk1pOXpZMmhsYldGekx6QjRNak13TXpsbE5qTTFObVZoTm1JM01ETmpaVFkzTW1VM1kyWmhZekJpTkRJM05qVmlNVFV3WmpZelpHWTNPR1V5WW1ReE9HRmxOemcxTnpnM1pqWmhNaUlzSW5SNWNHVWlPaUpHZFd4c1NuTnZibE5qYUdWdFlWWmhiR2xrWVhSdmNqSXdNakVpZlgxOS5QSUNDWldCNnA1elFveFZKT2Z0MXlRU09Gb1RncFM4cVdUUDNDdGdRN0hCSFN0VFNuVEllbGpncVBaaXZHbHNhOVItQW5aZlNtcGxwaTF3X21fZVlRUSJdfX0.HBfJM7yaYgz0Lm93fGFKnQb56r5DUIRZ_lSWaRFdPspzeI4sD0vTh2r2sSj7f3VjiJLPCc0eZivRuq28YmyUOA',
    ];
    const presentationSubmission = {
      id: 'Selective disclosure example presentation',
      definition_id: 'Selective disclosure example',
      descriptor_map: [
        {
          id: 'Ontario Health Insurance Plan',
          format: 'jwt_vp',
          path: '$[0]',
          path_nested: {
            format: 'jwt_vc',
            path: '$[0].vp.verifiableCredential[0]',
          },
        },
        {
          id: 'Ontario Health Insurance Plan',
          format: 'jwt_vp',
          path: '$[1]',
          path_nested: {
            format: 'jwt_vc',
            path: '$[1].vp.verifiableCredential[0]',
          },
        },
      ],
    };

    const vpTokenCredentialsExtractor = new VpTokenCredentialsExtractor(
      vpToken,
      presentationSubmission,
    );

    const credentials = vpTokenCredentialsExtractor.extract();

    expect(credentials).toEqual({
      result: { valid: true },
      vpTokenData: {
        vpToken,
        descriptorMapIds: [
          'Ontario Health Insurance Plan',
          'Ontario Health Insurance Plan',
        ],
        verifiableCredentialsDecoded: [
          {
            iss: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
            sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
            iat: 1589699260,
            nbf: 1589699260,
            exp: 1589699260,
            jti: 'urn:uuidb6916c10-8b64-4428-8bf5-cdf48383310c',
            vc: {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              id: 'urn:uuid:b6916c10-8b64-4428-8bf5-cdf48383310c',
              type: ['VerifiableCredential', 'VerifiableAttestation'],
              issuer: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
              issuanceDate: '2020-05-17T07:07:40Z',
              validFrom: '2020-05-17T07:07:40Z',
              validUntil: '2020-05-17T07:07:40Z',
              expirationDate: '2020-05-17T07:07:40Z',
              issued: '2020-05-17T07:07:40Z',
              credentialSubject: {
                id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
              },
              credentialSchema: {
                id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/0x23039e6356ea6b703ce672e7cfac0b42765b150f63df78e2bd18ae785787f6a2',
                type: 'FullJsonSchemaValidator2021',
              },
            },
          },
          {
            iss: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
            sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
            iat: 1589699260,
            nbf: 1589699260,
            exp: 1589699260,
            jti: 'urn:uuidb6916c10-8b64-4428-8bf5-cdf48383310c',
            vc: {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              id: 'urn:uuid:b6916c10-8b64-4428-8bf5-cdf48383310c',
              type: ['VerifiableCredential', 'VerifiableAttestation'],
              issuer: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
              issuanceDate: '2020-05-17T07:07:40Z',
              validFrom: '2020-05-17T07:07:40Z',
              validUntil: '2020-05-17T07:07:40Z',
              expirationDate: '2020-05-17T07:07:40Z',
              issued: '2020-05-17T07:07:40Z',
              credentialSubject: {
                id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
              },
              credentialSchema: {
                id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/0x23039e6356ea6b703ce672e7cfac0b42765b150f63df78e2bd18ae785787f6a2',
                type: 'FullJsonSchemaValidator2021',
              },
            },
          },
        ],
        verifiableCredentials: [
          {
            format: CredentialFormat.JWT,
            verifiableCredential:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYjY5MTZjMTAtOGI2NC00NDI4LThiZjUtY2RmNDgzODMzMTBjIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDpiNjkxNmMxMC04YjY0LTQ0MjgtOGJmNS1jZGY0ODM4MzMxMGMiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.EGsE1YXC_ZrJDBccqtafyJ-hmy6yQq9ynnYLg-ppP5dGnBMusLzgZbSXrawND61kAEs0jCc_cBb9nsH2GveMww',
          },
          {
            format: CredentialFormat.JWT,
            verifiableCredential:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYjY5MTZjMTAtOGI2NC00NDI4LThiZjUtY2RmNDgzODMzMTBjIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDpiNjkxNmMxMC04YjY0LTQ0MjgtOGJmNS1jZGY0ODM4MzMxMGMiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.EGsE1YXC_ZrJDBccqtafyJ-hmy6yQq9ynnYLg-ppP5dGnBMusLzgZbSXrawND61kAEs0jCc_cBb9nsH2GveMww',
          },
        ],
        vpTokenIssuer:
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
        decodedVerifiablePresentation: {
          aud: 'https://my.verifier.com/client_id',
          exp: 1589699260,
          iat: 1589699260,
          iss: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
          jti: 'urn:uuid:0706061a-e2ca-4614-9de7-9c1451935f02',
          nbf: 1589699260,
          nonce: 'FgkeErf91kfl',
          sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
          vp: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            holder:
              'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
            id: 'urn:uuid:0706061a-e2ca-4614-9de7-9c1451935f02',
            type: ['VerifiablePresentation'],
            verifiableCredential: [
              {
                exp: 1589699260,
                iat: 1589699260,
                iss: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
                jti: 'urn:uuidb6916c10-8b64-4428-8bf5-cdf48383310c',
                nbf: 1589699260,
                sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
                vc: {
                  '@context': ['https://www.w3.org/2018/credentials/v1'],
                  credentialSchema: {
                    id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/0x23039e6356ea6b703ce672e7cfac0b42765b150f63df78e2bd18ae785787f6a2',
                    type: 'FullJsonSchemaValidator2021',
                  },
                  credentialSubject: {
                    id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
                  },
                  expirationDate: '2020-05-17T07:07:40Z',
                  id: 'urn:uuid:b6916c10-8b64-4428-8bf5-cdf48383310c',
                  issuanceDate: '2020-05-17T07:07:40Z',
                  issued: '2020-05-17T07:07:40Z',
                  issuer: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
                  type: ['VerifiableCredential', 'VerifiableAttestation'],
                  validFrom: '2020-05-17T07:07:40Z',
                  validUntil: '2020-05-17T07:07:40Z',
                },
              },
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYmJmMzkyMWYtNzBmMS00YjA2LTg2NzAtYmY0ZDVkY2ZjYTYzIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDpiYmYzOTIxZi03MGYxLTRiMDYtODY3MC1iZjRkNWRjZmNhNjMiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.surXIU-j6OISSjwR9gm5HVrwViJYtSdCEhJye_d6mHoCInMEoWxjH45IxtEHDIeM3IrrW8b2f4Sz-CeBeIwNow',
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYTRkYWJhNWUtZGZiMC00ZjBiLTg4NTUtMWM0ZDk3ZWIyNGEyIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDphNGRhYmE1ZS1kZmIwLTRmMGItODg1NS0xYzRkOTdlYjI0YTIiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.PICCZWB6p5zQoxVJOft1yQSOFoTgpS8qWTP3CtgQ7HBHStTSnTIeljgqPZivGlsa9R-AnZfSmplpi1w_m_eYQQ',
            ],
          },
        },
      },
    });
  });

  it('return the list of credentials from vp_token, input: vp_token as string', () => {
    const vpToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciJ9.eyJpc3MiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJhdWQiOiJodHRwczovL215LnZlcmlmaWVyLmNvbS9jbGllbnRfaWQiLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJpYXQiOjE1ODk2OTkyNjAsIm5iZiI6MTU4OTY5OTI2MCwiZXhwIjoxNTg5Njk5MjYwLCJub25jZSI6IkZna2VFcmY5MWtmbCIsImp0aSI6InVybjp1dWlkOjA3MDYwNjFhLWUyY2EtNDYxNC05ZGU3LTljMTQ1MTkzNWYwMiIsInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sImlkIjoidXJuOnV1aWQ6MDcwNjA2MWEtZTJjYS00NjE0LTlkZTctOWMxNDUxOTM1ZjAyIiwidHlwZSI6WyJWZXJpZmlhYmxlUHJlc2VudGF0aW9uIl0sImhvbGRlciI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsInZlcmlmaWFibGVDcmVkZW50aWFsIjpbImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSkZVekkxTmlJc0ltdHBaQ0k2SW1ScFpEcGxZbk5wT25wMlNGZFlNelU1UVRORGRtWktia05aWVVGcFFXUmxJMFl3Y2pWUGVYUmZiR0ZvZG5aNk5rMVhiRmx6TTIxaldVNUxXbWxwVVdSVlpuRjJPSFJ6YUVoT09YY2lmUS5leUpwYzNNaU9pSmthV1E2WldKemFUcDZka2hYV0RNMU9VRXpRM1ptU201RFdXRkJhVUZrWlNJc0luTjFZaUk2SW1ScFpEcHJaWGs2ZWpKa2JYcEVPREZqWjFCNE9GWnJhVGRLWW5WMVRXMUdXWEpYVUdkWmIzbDBlV3RWV2pObGVYRm9kREZxT1V0aWMwVlpkbVJ5YW5oTmFsRTBkSEJ1YW1VNVFrUkNWSHAxVGtSUU0ydHVialp4VEZwRmNucGtOR0pLTldkdk1rTkRhRzlRYW1RMVIwRklNM3B3UmtwUU5XWjFkMU5yTmpaVk5WQnhOa1ZvUmpSdVMyNUlla1J1ZW01RlVEaG1XRGs1YmxwSFozZGlRV2d4YnpkSGFqRllOVEpVWkdobU4xVTBTMVJyTmpaNGMwRTFjaUlzSW1saGRDSTZNVFU0T1RZNU9USTJNQ3dpYm1KbUlqb3hOVGc1TmprNU1qWXdMQ0psZUhBaU9qRTFPRGsyT1RreU5qQXNJbXAwYVNJNkluVnlianAxZFdsa1lqWTVNVFpqTVRBdE9HSTJOQzAwTkRJNExUaGlaalV0WTJSbU5EZ3pPRE16TVRCaklpd2lkbU1pT25zaVFHTnZiblJsZUhRaU9sc2lhSFIwY0hNNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TVRndlkzSmxaR1Z1ZEdsaGJITXZkakVpWFN3aWFXUWlPaUoxY200NmRYVnBaRHBpTmpreE5tTXhNQzA0WWpZMExUUTBNamd0T0dKbU5TMWpaR1kwT0RNNE16TXhNR01pTENKMGVYQmxJanBiSWxabGNtbG1hV0ZpYkdWRGNtVmtaVzUwYVdGc0lpd2lWbVZ5YVdacFlXSnNaVUYwZEdWemRHRjBhVzl1SWwwc0ltbHpjM1ZsY2lJNkltUnBaRHBsWW5OcE9ucDJTRmRZTXpVNVFUTkRkbVpLYmtOWllVRnBRV1JsSWl3aWFYTnpkV0Z1WTJWRVlYUmxJam9pTWpBeU1DMHdOUzB4TjFRd056b3dOem8wTUZvaUxDSjJZV3hwWkVaeWIyMGlPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0luWmhiR2xrVlc1MGFXd2lPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0ltVjRjR2x5WVhScGIyNUVZWFJsSWpvaU1qQXlNQzB3TlMweE4xUXdOem93TnpvME1Gb2lMQ0pwYzNOMVpXUWlPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0ltTnlaV1JsYm5ScFlXeFRkV0pxWldOMElqcDdJbWxrSWpvaVpHbGtPbXRsZVRwNk1tUnRla1E0TVdOblVIZzRWbXRwTjBwaWRYVk5iVVpaY2xkUVoxbHZlWFI1YTFWYU0yVjVjV2gwTVdvNVMySnpSVmwyWkhKcWVFMXFVVFIwY0c1cVpUbENSRUpVZW5WT1JGQXphMjV1Tm5GTVdrVnllbVEwWWtvMVoyOHlRME5vYjFCcVpEVkhRVWd6ZW5CR1NsQTFablYzVTJzMk5sVTFVSEUyUldoR05HNUxia2g2Ukc1NmJrVlFPR1pZT1RsdVdrZG5kMkpCYURGdk4wZHFNVmcxTWxSa2FHWTNWVFJMVkdzMk5uaHpRVFZ5SW4wc0ltTnlaV1JsYm5ScFlXeFRZMmhsYldFaU9uc2lhV1FpT2lKb2RIUndjem92TDJGd2FTMXdhV3h2ZEM1bFluTnBMbVYxTDNSeWRYTjBaV1F0YzJOb1pXMWhjeTF5WldkcGMzUnllUzkyTWk5elkyaGxiV0Z6THpCNE1qTXdNemxsTmpNMU5tVmhObUkzTUROalpUWTNNbVUzWTJaaFl6QmlOREkzTmpWaU1UVXdaall6WkdZM09HVXlZbVF4T0dGbE56ZzFOemczWmpaaE1pSXNJblI1Y0dVaU9pSkdkV3hzU25OdmJsTmphR1Z0WVZaaGJHbGtZWFJ2Y2pJd01qRWlmWDE5LkVHc0UxWVhDX1pySkRCY2NxdGFmeUotaG15NnlRcTl5bm5ZTGctcHBQNWRHbkJNdXNMemdaYlNYcmF3TkQ2MWtBRXMwakNjX2NCYjluc0gyR3ZlTXd3IiwiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKRlV6STFOaUlzSW10cFpDSTZJbVJwWkRwbFluTnBPbnAyU0ZkWU16VTVRVE5EZG1aS2JrTlpZVUZwUVdSbEkwWXdjalZQZVhSZmJHRm9kblo2TmsxWGJGbHpNMjFqV1U1TFdtbHBVV1JWWm5GMk9IUnphRWhPT1hjaWZRLmV5SnBjM01pT2lKa2FXUTZaV0p6YVRwNmRraFhXRE0xT1VFelEzWm1TbTVEV1dGQmFVRmtaU0lzSW5OMVlpSTZJbVJwWkRwclpYazZlakprYlhwRU9ERmpaMUI0T0ZacmFUZEtZblYxVFcxR1dYSlhVR2RaYjNsMGVXdFZXak5sZVhGb2RERnFPVXRpYzBWWmRtUnlhbmhOYWxFMGRIQnVhbVU1UWtSQ1ZIcDFUa1JRTTJ0dWJqWnhURnBGY25wa05HSktOV2R2TWtORGFHOVFhbVExUjBGSU0zcHdSa3BRTldaMWQxTnJOalpWTlZCeE5rVm9SalJ1UzI1SWVrUnVlbTVGVURobVdEazVibHBIWjNkaVFXZ3hiemRIYWpGWU5USlVaR2htTjFVMFMxUnJOalo0YzBFMWNpSXNJbWxoZENJNk1UVTRPVFk1T1RJMk1Dd2libUptSWpveE5UZzVOams1TWpZd0xDSmxlSEFpT2pFMU9EazJPVGt5TmpBc0ltcDBhU0k2SW5WeWJqcDFkV2xrWW1KbU16a3lNV1l0TnpCbU1TMDBZakEyTFRnMk56QXRZbVkwWkRWa1kyWmpZVFl6SWl3aWRtTWlPbnNpUUdOdmJuUmxlSFFpT2xzaWFIUjBjSE02THk5M2QzY3Vkek11YjNKbkx6SXdNVGd2WTNKbFpHVnVkR2xoYkhNdmRqRWlYU3dpYVdRaU9pSjFjbTQ2ZFhWcFpEcGlZbVl6T1RJeFppMDNNR1l4TFRSaU1EWXRPRFkzTUMxaVpqUmtOV1JqWm1OaE5qTWlMQ0owZVhCbElqcGJJbFpsY21sbWFXRmliR1ZEY21Wa1pXNTBhV0ZzSWl3aVZtVnlhV1pwWVdKc1pVRjBkR1Z6ZEdGMGFXOXVJbDBzSW1semMzVmxjaUk2SW1ScFpEcGxZbk5wT25wMlNGZFlNelU1UVRORGRtWktia05aWVVGcFFXUmxJaXdpYVhOemRXRnVZMlZFWVhSbElqb2lNakF5TUMwd05TMHhOMVF3Tnpvd056bzBNRm9pTENKMllXeHBaRVp5YjIwaU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW5aaGJHbGtWVzUwYVd3aU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW1WNGNHbHlZWFJwYjI1RVlYUmxJam9pTWpBeU1DMHdOUzB4TjFRd056b3dOem8wTUZvaUxDSnBjM04xWldRaU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW1OeVpXUmxiblJwWVd4VGRXSnFaV04wSWpwN0ltbGtJam9pWkdsa09tdGxlVHA2TW1SdGVrUTRNV05uVUhnNFZtdHBOMHBpZFhWTmJVWlpjbGRRWjFsdmVYUjVhMVZhTTJWNWNXaDBNV281UzJKelJWbDJaSEpxZUUxcVVUUjBjRzVxWlRsQ1JFSlVlblZPUkZBemEyNXVObkZNV2tWeWVtUTBZa28xWjI4eVEwTm9iMUJxWkRWSFFVZ3plbkJHU2xBMVpuVjNVMnMyTmxVMVVIRTJSV2hHTkc1TGJraDZSRzU2YmtWUU9HWllPVGx1V2tkbmQySkJhREZ2TjBkcU1WZzFNbFJrYUdZM1ZUUkxWR3MyTm5oelFUVnlJbjBzSW1OeVpXUmxiblJwWVd4VFkyaGxiV0VpT25zaWFXUWlPaUpvZEhSd2N6b3ZMMkZ3YVMxd2FXeHZkQzVsWW5OcExtVjFMM1J5ZFhOMFpXUXRjMk5vWlcxaGN5MXlaV2RwYzNSeWVTOTJNaTl6WTJobGJXRnpMekI0TWpNd016bGxOak0xTm1WaE5tSTNNRE5qWlRZM01tVTNZMlpoWXpCaU5ESTNOalZpTVRVd1pqWXpaR1kzT0dVeVltUXhPR0ZsTnpnMU56ZzNaalpoTWlJc0luUjVjR1VpT2lKR2RXeHNTbk52YmxOamFHVnRZVlpoYkdsa1lYUnZjakl3TWpFaWZYMTkuc3VyWElVLWo2T0lTU2p3UjlnbTVIVnJ3VmlKWXRTZENFaEp5ZV9kNm1Ib0NJbk1Fb1d4akg0NUl4dEVIREllTTNJcnJXOGIyZjRTei1DZUJlSXdOb3ciLCJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNkltUnBaRHBsWW5OcE9ucDJTRmRZTXpVNVFUTkRkbVpLYmtOWllVRnBRV1JsSTBZd2NqVlBlWFJmYkdGb2RuWjZOazFYYkZsek0yMWpXVTVMV21scFVXUlZabkYyT0hSemFFaE9PWGNpZlEuZXlKcGMzTWlPaUprYVdRNlpXSnphVHA2ZGtoWFdETTFPVUV6UTNabVNtNURXV0ZCYVVGa1pTSXNJbk4xWWlJNkltUnBaRHByWlhrNmVqSmtiWHBFT0RGaloxQjRPRlpyYVRkS1luVjFUVzFHV1hKWFVHZFpiM2wwZVd0VldqTmxlWEZvZERGcU9VdGljMFZaZG1SeWFuaE5hbEUwZEhCdWFtVTVRa1JDVkhwMVRrUlFNMnR1YmpaeFRGcEZjbnBrTkdKS05XZHZNa05EYUc5UWFtUTFSMEZJTTNwd1JrcFFOV1oxZDFOck5qWlZOVkJ4TmtWb1JqUnVTMjVJZWtSdWVtNUZVRGhtV0RrNWJscEhaM2RpUVdneGJ6ZEhhakZZTlRKVVpHaG1OMVUwUzFSck5qWjRjMEUxY2lJc0ltbGhkQ0k2TVRVNE9UWTVPVEkyTUN3aWJtSm1Jam94TlRnNU5qazVNall3TENKbGVIQWlPakUxT0RrMk9Ua3lOakFzSW1wMGFTSTZJblZ5YmpwMWRXbGtZVFJrWVdKaE5XVXRaR1ppTUMwMFpqQmlMVGc0TlRVdE1XTTBaRGszWldJeU5HRXlJaXdpZG1NaU9uc2lRR052Ym5SbGVIUWlPbHNpYUhSMGNITTZMeTkzZDNjdWR6TXViM0puTHpJd01UZ3ZZM0psWkdWdWRHbGhiSE12ZGpFaVhTd2lhV1FpT2lKMWNtNDZkWFZwWkRwaE5HUmhZbUUxWlMxa1ptSXdMVFJtTUdJdE9EZzFOUzB4WXpSa09UZGxZakkwWVRJaUxDSjBlWEJsSWpwYklsWmxjbWxtYVdGaWJHVkRjbVZrWlc1MGFXRnNJaXdpVm1WeWFXWnBZV0pzWlVGMGRHVnpkR0YwYVc5dUlsMHNJbWx6YzNWbGNpSTZJbVJwWkRwbFluTnBPbnAyU0ZkWU16VTVRVE5EZG1aS2JrTlpZVUZwUVdSbElpd2lhWE56ZFdGdVkyVkVZWFJsSWpvaU1qQXlNQzB3TlMweE4xUXdOem93TnpvME1Gb2lMQ0oyWVd4cFpFWnliMjBpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJblpoYkdsa1ZXNTBhV3dpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJbVY0Y0dseVlYUnBiMjVFWVhSbElqb2lNakF5TUMwd05TMHhOMVF3Tnpvd056bzBNRm9pTENKcGMzTjFaV1FpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJbU55WldSbGJuUnBZV3hUZFdKcVpXTjBJanA3SW1sa0lqb2laR2xrT210bGVUcDZNbVJ0ZWtRNE1XTm5VSGc0Vm10cE4wcGlkWFZOYlVaWmNsZFFaMWx2ZVhSNWExVmFNMlY1Y1doME1XbzVTMkp6UlZsMlpISnFlRTFxVVRSMGNHNXFaVGxDUkVKVWVuVk9SRkF6YTI1dU5uRk1Xa1Z5ZW1RMFlrbzFaMjh5UTBOb2IxQnFaRFZIUVVnemVuQkdTbEExWm5WM1UyczJObFUxVUhFMlJXaEdORzVMYmtoNlJHNTZia1ZRT0daWU9UbHVXa2RuZDJKQmFERnZOMGRxTVZnMU1sUmthR1kzVlRSTFZHczJObmh6UVRWeUluMHNJbU55WldSbGJuUnBZV3hUWTJobGJXRWlPbnNpYVdRaU9pSm9kSFJ3Y3pvdkwyRndhUzF3YVd4dmRDNWxZbk5wTG1WMUwzUnlkWE4wWldRdGMyTm9aVzFoY3kxeVpXZHBjM1J5ZVM5Mk1pOXpZMmhsYldGekx6QjRNak13TXpsbE5qTTFObVZoTm1JM01ETmpaVFkzTW1VM1kyWmhZekJpTkRJM05qVmlNVFV3WmpZelpHWTNPR1V5WW1ReE9HRmxOemcxTnpnM1pqWmhNaUlzSW5SNWNHVWlPaUpHZFd4c1NuTnZibE5qYUdWdFlWWmhiR2xrWVhSdmNqSXdNakVpZlgxOS5QSUNDWldCNnA1elFveFZKT2Z0MXlRU09Gb1RncFM4cVdUUDNDdGdRN0hCSFN0VFNuVEllbGpncVBaaXZHbHNhOVItQW5aZlNtcGxwaTF3X21fZVlRUSJdfX0.HBfJM7yaYgz0Lm93fGFKnQb56r5DUIRZ_lSWaRFdPspzeI4sD0vTh2r2sSj7f3VjiJLPCc0eZivRuq28YmyUOA';
    const presentationSubmission = {
      id: 'Selective disclosure example presentation',
      definition_id: 'Selective disclosure example',
      descriptor_map: [
        {
          id: 'Ontario Health Insurance Plan',
          format: 'jwt_vp',
          path: '$',
          path_nested: {
            format: 'jwt_vc',
            path: '$.vp.verifiableCredential[0]',
          },
        },
      ],
    };

    const vpTokenCredentialsExtractor = new VpTokenCredentialsExtractor(
      vpToken,
      presentationSubmission,
    );

    const credentials = vpTokenCredentialsExtractor.extract();

    expect(credentials).toEqual({
      result: { valid: true },
      vpTokenData: {
        vpToken,
        descriptorMapIds: ['Ontario Health Insurance Plan'],
        verifiableCredentialsDecoded: [
          {
            iss: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
            sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
            iat: 1589699260,
            nbf: 1589699260,
            exp: 1589699260,
            jti: 'urn:uuidb6916c10-8b64-4428-8bf5-cdf48383310c',
            vc: {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              id: 'urn:uuid:b6916c10-8b64-4428-8bf5-cdf48383310c',
              type: ['VerifiableCredential', 'VerifiableAttestation'],
              issuer: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
              issuanceDate: '2020-05-17T07:07:40Z',
              validFrom: '2020-05-17T07:07:40Z',
              validUntil: '2020-05-17T07:07:40Z',
              expirationDate: '2020-05-17T07:07:40Z',
              issued: '2020-05-17T07:07:40Z',
              credentialSubject: {
                id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
              },
              credentialSchema: {
                id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/0x23039e6356ea6b703ce672e7cfac0b42765b150f63df78e2bd18ae785787f6a2',
                type: 'FullJsonSchemaValidator2021',
              },
            },
          },
        ],
        verifiableCredentials: [
          {
            format: CredentialFormat.JWT,
            verifiableCredential:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYjY5MTZjMTAtOGI2NC00NDI4LThiZjUtY2RmNDgzODMzMTBjIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDpiNjkxNmMxMC04YjY0LTQ0MjgtOGJmNS1jZGY0ODM4MzMxMGMiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.EGsE1YXC_ZrJDBccqtafyJ-hmy6yQq9ynnYLg-ppP5dGnBMusLzgZbSXrawND61kAEs0jCc_cBb9nsH2GveMww',
          },
        ],
        vpTokenIssuer:
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
        decodedVerifiablePresentation: {
          aud: 'https://my.verifier.com/client_id',
          exp: 1589699260,
          iat: 1589699260,
          iss: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
          jti: 'urn:uuid:0706061a-e2ca-4614-9de7-9c1451935f02',
          nbf: 1589699260,
          nonce: 'FgkeErf91kfl',
          sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
          vp: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            holder:
              'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
            id: 'urn:uuid:0706061a-e2ca-4614-9de7-9c1451935f02',
            type: ['VerifiablePresentation'],
            verifiableCredential: [
              {
                exp: 1589699260,
                iat: 1589699260,
                iss: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
                jti: 'urn:uuidb6916c10-8b64-4428-8bf5-cdf48383310c',
                nbf: 1589699260,
                sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
                vc: {
                  '@context': ['https://www.w3.org/2018/credentials/v1'],
                  credentialSchema: {
                    id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/0x23039e6356ea6b703ce672e7cfac0b42765b150f63df78e2bd18ae785787f6a2',
                    type: 'FullJsonSchemaValidator2021',
                  },
                  credentialSubject: {
                    id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
                  },
                  expirationDate: '2020-05-17T07:07:40Z',
                  id: 'urn:uuid:b6916c10-8b64-4428-8bf5-cdf48383310c',
                  issuanceDate: '2020-05-17T07:07:40Z',
                  issued: '2020-05-17T07:07:40Z',
                  issuer: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
                  type: ['VerifiableCredential', 'VerifiableAttestation'],
                  validFrom: '2020-05-17T07:07:40Z',
                  validUntil: '2020-05-17T07:07:40Z',
                },
              },
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYmJmMzkyMWYtNzBmMS00YjA2LTg2NzAtYmY0ZDVkY2ZjYTYzIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDpiYmYzOTIxZi03MGYxLTRiMDYtODY3MC1iZjRkNWRjZmNhNjMiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.surXIU-j6OISSjwR9gm5HVrwViJYtSdCEhJye_d6mHoCInMEoWxjH45IxtEHDIeM3IrrW8b2f4Sz-CeBeIwNow',
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYTRkYWJhNWUtZGZiMC00ZjBiLTg4NTUtMWM0ZDk3ZWIyNGEyIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDphNGRhYmE1ZS1kZmIwLTRmMGItODg1NS0xYzRkOTdlYjI0YTIiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.PICCZWB6p5zQoxVJOft1yQSOFoTgpS8qWTP3CtgQ7HBHStTSnTIeljgqPZivGlsa9R-AnZfSmplpi1w_m_eYQQ',
            ],
          },
        },
      },
    });
  });

  it('return the list of credentials from vp_token, input: vp_token as string and without presentationSubmission', () => {
    const vpToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciJ9.eyJpc3MiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJhdWQiOiJodHRwczovL215LnZlcmlmaWVyLmNvbS9jbGllbnRfaWQiLCJzdWIiOiJkaWQ6a2V5OnoyZG16RDgxY2dQeDhWa2k3SmJ1dU1tRllyV1BnWW95dHlrVVozZXlxaHQxajlLYnNFWXZkcmp4TWpRNHRwbmplOUJEQlR6dU5EUDNrbm42cUxaRXJ6ZDRiSjVnbzJDQ2hvUGpkNUdBSDN6cEZKUDVmdXdTazY2VTVQcTZFaEY0bktuSHpEbnpuRVA4Zlg5OW5aR2d3YkFoMW83R2oxWDUyVGRoZjdVNEtUazY2eHNBNXIiLCJpYXQiOjE1ODk2OTkyNjAsIm5iZiI6MTU4OTY5OTI2MCwiZXhwIjoxNTg5Njk5MjYwLCJub25jZSI6IkZna2VFcmY5MWtmbCIsImp0aSI6InVybjp1dWlkOjA3MDYwNjFhLWUyY2EtNDYxNC05ZGU3LTljMTQ1MTkzNWYwMiIsInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sImlkIjoidXJuOnV1aWQ6MDcwNjA2MWEtZTJjYS00NjE0LTlkZTctOWMxNDUxOTM1ZjAyIiwidHlwZSI6WyJWZXJpZmlhYmxlUHJlc2VudGF0aW9uIl0sImhvbGRlciI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsInZlcmlmaWFibGVDcmVkZW50aWFsIjpbImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSkZVekkxTmlJc0ltdHBaQ0k2SW1ScFpEcGxZbk5wT25wMlNGZFlNelU1UVRORGRtWktia05aWVVGcFFXUmxJMFl3Y2pWUGVYUmZiR0ZvZG5aNk5rMVhiRmx6TTIxaldVNUxXbWxwVVdSVlpuRjJPSFJ6YUVoT09YY2lmUS5leUpwYzNNaU9pSmthV1E2WldKemFUcDZka2hYV0RNMU9VRXpRM1ptU201RFdXRkJhVUZrWlNJc0luTjFZaUk2SW1ScFpEcHJaWGs2ZWpKa2JYcEVPREZqWjFCNE9GWnJhVGRLWW5WMVRXMUdXWEpYVUdkWmIzbDBlV3RWV2pObGVYRm9kREZxT1V0aWMwVlpkbVJ5YW5oTmFsRTBkSEJ1YW1VNVFrUkNWSHAxVGtSUU0ydHVialp4VEZwRmNucGtOR0pLTldkdk1rTkRhRzlRYW1RMVIwRklNM3B3UmtwUU5XWjFkMU5yTmpaVk5WQnhOa1ZvUmpSdVMyNUlla1J1ZW01RlVEaG1XRGs1YmxwSFozZGlRV2d4YnpkSGFqRllOVEpVWkdobU4xVTBTMVJyTmpaNGMwRTFjaUlzSW1saGRDSTZNVFU0T1RZNU9USTJNQ3dpYm1KbUlqb3hOVGc1TmprNU1qWXdMQ0psZUhBaU9qRTFPRGsyT1RreU5qQXNJbXAwYVNJNkluVnlianAxZFdsa1lqWTVNVFpqTVRBdE9HSTJOQzAwTkRJNExUaGlaalV0WTJSbU5EZ3pPRE16TVRCaklpd2lkbU1pT25zaVFHTnZiblJsZUhRaU9sc2lhSFIwY0hNNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TVRndlkzSmxaR1Z1ZEdsaGJITXZkakVpWFN3aWFXUWlPaUoxY200NmRYVnBaRHBpTmpreE5tTXhNQzA0WWpZMExUUTBNamd0T0dKbU5TMWpaR1kwT0RNNE16TXhNR01pTENKMGVYQmxJanBiSWxabGNtbG1hV0ZpYkdWRGNtVmtaVzUwYVdGc0lpd2lWbVZ5YVdacFlXSnNaVUYwZEdWemRHRjBhVzl1SWwwc0ltbHpjM1ZsY2lJNkltUnBaRHBsWW5OcE9ucDJTRmRZTXpVNVFUTkRkbVpLYmtOWllVRnBRV1JsSWl3aWFYTnpkV0Z1WTJWRVlYUmxJam9pTWpBeU1DMHdOUzB4TjFRd056b3dOem8wTUZvaUxDSjJZV3hwWkVaeWIyMGlPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0luWmhiR2xrVlc1MGFXd2lPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0ltVjRjR2x5WVhScGIyNUVZWFJsSWpvaU1qQXlNQzB3TlMweE4xUXdOem93TnpvME1Gb2lMQ0pwYzNOMVpXUWlPaUl5TURJd0xUQTFMVEUzVkRBM09qQTNPalF3V2lJc0ltTnlaV1JsYm5ScFlXeFRkV0pxWldOMElqcDdJbWxrSWpvaVpHbGtPbXRsZVRwNk1tUnRla1E0TVdOblVIZzRWbXRwTjBwaWRYVk5iVVpaY2xkUVoxbHZlWFI1YTFWYU0yVjVjV2gwTVdvNVMySnpSVmwyWkhKcWVFMXFVVFIwY0c1cVpUbENSRUpVZW5WT1JGQXphMjV1Tm5GTVdrVnllbVEwWWtvMVoyOHlRME5vYjFCcVpEVkhRVWd6ZW5CR1NsQTFablYzVTJzMk5sVTFVSEUyUldoR05HNUxia2g2Ukc1NmJrVlFPR1pZT1RsdVdrZG5kMkpCYURGdk4wZHFNVmcxTWxSa2FHWTNWVFJMVkdzMk5uaHpRVFZ5SW4wc0ltTnlaV1JsYm5ScFlXeFRZMmhsYldFaU9uc2lhV1FpT2lKb2RIUndjem92TDJGd2FTMXdhV3h2ZEM1bFluTnBMbVYxTDNSeWRYTjBaV1F0YzJOb1pXMWhjeTF5WldkcGMzUnllUzkyTWk5elkyaGxiV0Z6THpCNE1qTXdNemxsTmpNMU5tVmhObUkzTUROalpUWTNNbVUzWTJaaFl6QmlOREkzTmpWaU1UVXdaall6WkdZM09HVXlZbVF4T0dGbE56ZzFOemczWmpaaE1pSXNJblI1Y0dVaU9pSkdkV3hzU25OdmJsTmphR1Z0WVZaaGJHbGtZWFJ2Y2pJd01qRWlmWDE5LkVHc0UxWVhDX1pySkRCY2NxdGFmeUotaG15NnlRcTl5bm5ZTGctcHBQNWRHbkJNdXNMemdaYlNYcmF3TkQ2MWtBRXMwakNjX2NCYjluc0gyR3ZlTXd3IiwiZXlKMGVYQWlPaUpLVjFRaUxDSmhiR2NpT2lKRlV6STFOaUlzSW10cFpDSTZJbVJwWkRwbFluTnBPbnAyU0ZkWU16VTVRVE5EZG1aS2JrTlpZVUZwUVdSbEkwWXdjalZQZVhSZmJHRm9kblo2TmsxWGJGbHpNMjFqV1U1TFdtbHBVV1JWWm5GMk9IUnphRWhPT1hjaWZRLmV5SnBjM01pT2lKa2FXUTZaV0p6YVRwNmRraFhXRE0xT1VFelEzWm1TbTVEV1dGQmFVRmtaU0lzSW5OMVlpSTZJbVJwWkRwclpYazZlakprYlhwRU9ERmpaMUI0T0ZacmFUZEtZblYxVFcxR1dYSlhVR2RaYjNsMGVXdFZXak5sZVhGb2RERnFPVXRpYzBWWmRtUnlhbmhOYWxFMGRIQnVhbVU1UWtSQ1ZIcDFUa1JRTTJ0dWJqWnhURnBGY25wa05HSktOV2R2TWtORGFHOVFhbVExUjBGSU0zcHdSa3BRTldaMWQxTnJOalpWTlZCeE5rVm9SalJ1UzI1SWVrUnVlbTVGVURobVdEazVibHBIWjNkaVFXZ3hiemRIYWpGWU5USlVaR2htTjFVMFMxUnJOalo0YzBFMWNpSXNJbWxoZENJNk1UVTRPVFk1T1RJMk1Dd2libUptSWpveE5UZzVOams1TWpZd0xDSmxlSEFpT2pFMU9EazJPVGt5TmpBc0ltcDBhU0k2SW5WeWJqcDFkV2xrWW1KbU16a3lNV1l0TnpCbU1TMDBZakEyTFRnMk56QXRZbVkwWkRWa1kyWmpZVFl6SWl3aWRtTWlPbnNpUUdOdmJuUmxlSFFpT2xzaWFIUjBjSE02THk5M2QzY3Vkek11YjNKbkx6SXdNVGd2WTNKbFpHVnVkR2xoYkhNdmRqRWlYU3dpYVdRaU9pSjFjbTQ2ZFhWcFpEcGlZbVl6T1RJeFppMDNNR1l4TFRSaU1EWXRPRFkzTUMxaVpqUmtOV1JqWm1OaE5qTWlMQ0owZVhCbElqcGJJbFpsY21sbWFXRmliR1ZEY21Wa1pXNTBhV0ZzSWl3aVZtVnlhV1pwWVdKc1pVRjBkR1Z6ZEdGMGFXOXVJbDBzSW1semMzVmxjaUk2SW1ScFpEcGxZbk5wT25wMlNGZFlNelU1UVRORGRtWktia05aWVVGcFFXUmxJaXdpYVhOemRXRnVZMlZFWVhSbElqb2lNakF5TUMwd05TMHhOMVF3Tnpvd056bzBNRm9pTENKMllXeHBaRVp5YjIwaU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW5aaGJHbGtWVzUwYVd3aU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW1WNGNHbHlZWFJwYjI1RVlYUmxJam9pTWpBeU1DMHdOUzB4TjFRd056b3dOem8wTUZvaUxDSnBjM04xWldRaU9pSXlNREl3TFRBMUxURTNWREEzT2pBM09qUXdXaUlzSW1OeVpXUmxiblJwWVd4VGRXSnFaV04wSWpwN0ltbGtJam9pWkdsa09tdGxlVHA2TW1SdGVrUTRNV05uVUhnNFZtdHBOMHBpZFhWTmJVWlpjbGRRWjFsdmVYUjVhMVZhTTJWNWNXaDBNV281UzJKelJWbDJaSEpxZUUxcVVUUjBjRzVxWlRsQ1JFSlVlblZPUkZBemEyNXVObkZNV2tWeWVtUTBZa28xWjI4eVEwTm9iMUJxWkRWSFFVZ3plbkJHU2xBMVpuVjNVMnMyTmxVMVVIRTJSV2hHTkc1TGJraDZSRzU2YmtWUU9HWllPVGx1V2tkbmQySkJhREZ2TjBkcU1WZzFNbFJrYUdZM1ZUUkxWR3MyTm5oelFUVnlJbjBzSW1OeVpXUmxiblJwWVd4VFkyaGxiV0VpT25zaWFXUWlPaUpvZEhSd2N6b3ZMMkZ3YVMxd2FXeHZkQzVsWW5OcExtVjFMM1J5ZFhOMFpXUXRjMk5vWlcxaGN5MXlaV2RwYzNSeWVTOTJNaTl6WTJobGJXRnpMekI0TWpNd016bGxOak0xTm1WaE5tSTNNRE5qWlRZM01tVTNZMlpoWXpCaU5ESTNOalZpTVRVd1pqWXpaR1kzT0dVeVltUXhPR0ZsTnpnMU56ZzNaalpoTWlJc0luUjVjR1VpT2lKR2RXeHNTbk52YmxOamFHVnRZVlpoYkdsa1lYUnZjakl3TWpFaWZYMTkuc3VyWElVLWo2T0lTU2p3UjlnbTVIVnJ3VmlKWXRTZENFaEp5ZV9kNm1Ib0NJbk1Fb1d4akg0NUl4dEVIREllTTNJcnJXOGIyZjRTei1DZUJlSXdOb3ciLCJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNkltUnBaRHBsWW5OcE9ucDJTRmRZTXpVNVFUTkRkbVpLYmtOWllVRnBRV1JsSTBZd2NqVlBlWFJmYkdGb2RuWjZOazFYYkZsek0yMWpXVTVMV21scFVXUlZabkYyT0hSemFFaE9PWGNpZlEuZXlKcGMzTWlPaUprYVdRNlpXSnphVHA2ZGtoWFdETTFPVUV6UTNabVNtNURXV0ZCYVVGa1pTSXNJbk4xWWlJNkltUnBaRHByWlhrNmVqSmtiWHBFT0RGaloxQjRPRlpyYVRkS1luVjFUVzFHV1hKWFVHZFpiM2wwZVd0VldqTmxlWEZvZERGcU9VdGljMFZaZG1SeWFuaE5hbEUwZEhCdWFtVTVRa1JDVkhwMVRrUlFNMnR1YmpaeFRGcEZjbnBrTkdKS05XZHZNa05EYUc5UWFtUTFSMEZJTTNwd1JrcFFOV1oxZDFOck5qWlZOVkJ4TmtWb1JqUnVTMjVJZWtSdWVtNUZVRGhtV0RrNWJscEhaM2RpUVdneGJ6ZEhhakZZTlRKVVpHaG1OMVUwUzFSck5qWjRjMEUxY2lJc0ltbGhkQ0k2TVRVNE9UWTVPVEkyTUN3aWJtSm1Jam94TlRnNU5qazVNall3TENKbGVIQWlPakUxT0RrMk9Ua3lOakFzSW1wMGFTSTZJblZ5YmpwMWRXbGtZVFJrWVdKaE5XVXRaR1ppTUMwMFpqQmlMVGc0TlRVdE1XTTBaRGszWldJeU5HRXlJaXdpZG1NaU9uc2lRR052Ym5SbGVIUWlPbHNpYUhSMGNITTZMeTkzZDNjdWR6TXViM0puTHpJd01UZ3ZZM0psWkdWdWRHbGhiSE12ZGpFaVhTd2lhV1FpT2lKMWNtNDZkWFZwWkRwaE5HUmhZbUUxWlMxa1ptSXdMVFJtTUdJdE9EZzFOUzB4WXpSa09UZGxZakkwWVRJaUxDSjBlWEJsSWpwYklsWmxjbWxtYVdGaWJHVkRjbVZrWlc1MGFXRnNJaXdpVm1WeWFXWnBZV0pzWlVGMGRHVnpkR0YwYVc5dUlsMHNJbWx6YzNWbGNpSTZJbVJwWkRwbFluTnBPbnAyU0ZkWU16VTVRVE5EZG1aS2JrTlpZVUZwUVdSbElpd2lhWE56ZFdGdVkyVkVZWFJsSWpvaU1qQXlNQzB3TlMweE4xUXdOem93TnpvME1Gb2lMQ0oyWVd4cFpFWnliMjBpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJblpoYkdsa1ZXNTBhV3dpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJbVY0Y0dseVlYUnBiMjVFWVhSbElqb2lNakF5TUMwd05TMHhOMVF3Tnpvd056bzBNRm9pTENKcGMzTjFaV1FpT2lJeU1ESXdMVEExTFRFM1ZEQTNPakEzT2pRd1dpSXNJbU55WldSbGJuUnBZV3hUZFdKcVpXTjBJanA3SW1sa0lqb2laR2xrT210bGVUcDZNbVJ0ZWtRNE1XTm5VSGc0Vm10cE4wcGlkWFZOYlVaWmNsZFFaMWx2ZVhSNWExVmFNMlY1Y1doME1XbzVTMkp6UlZsMlpISnFlRTFxVVRSMGNHNXFaVGxDUkVKVWVuVk9SRkF6YTI1dU5uRk1Xa1Z5ZW1RMFlrbzFaMjh5UTBOb2IxQnFaRFZIUVVnemVuQkdTbEExWm5WM1UyczJObFUxVUhFMlJXaEdORzVMYmtoNlJHNTZia1ZRT0daWU9UbHVXa2RuZDJKQmFERnZOMGRxTVZnMU1sUmthR1kzVlRSTFZHczJObmh6UVRWeUluMHNJbU55WldSbGJuUnBZV3hUWTJobGJXRWlPbnNpYVdRaU9pSm9kSFJ3Y3pvdkwyRndhUzF3YVd4dmRDNWxZbk5wTG1WMUwzUnlkWE4wWldRdGMyTm9aVzFoY3kxeVpXZHBjM1J5ZVM5Mk1pOXpZMmhsYldGekx6QjRNak13TXpsbE5qTTFObVZoTm1JM01ETmpaVFkzTW1VM1kyWmhZekJpTkRJM05qVmlNVFV3WmpZelpHWTNPR1V5WW1ReE9HRmxOemcxTnpnM1pqWmhNaUlzSW5SNWNHVWlPaUpHZFd4c1NuTnZibE5qYUdWdFlWWmhiR2xrWVhSdmNqSXdNakVpZlgxOS5QSUNDWldCNnA1elFveFZKT2Z0MXlRU09Gb1RncFM4cVdUUDNDdGdRN0hCSFN0VFNuVEllbGpncVBaaXZHbHNhOVItQW5aZlNtcGxwaTF3X21fZVlRUSJdfX0.HBfJM7yaYgz0Lm93fGFKnQb56r5DUIRZ_lSWaRFdPspzeI4sD0vTh2r2sSj7f3VjiJLPCc0eZivRuq28YmyUOA';

    const vpTokenCredentialsExtractor = new VpTokenCredentialsExtractor(
      vpToken,
    );

    const credentials = vpTokenCredentialsExtractor.extract();

    expect(credentials).toEqual({
      result: { valid: true },
      vpTokenData: {
        vpToken,
        vpTokenIssuer:
          'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',

        descriptorMapIds: [],
        verifiableCredentialsDecoded: [
          {
            exp: 1589699260,
            iat: 1589699260,
            iss: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
            jti: 'urn:uuidb6916c10-8b64-4428-8bf5-cdf48383310c',
            nbf: 1589699260,
            sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
            vc: {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              credentialSchema: {
                id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/0x23039e6356ea6b703ce672e7cfac0b42765b150f63df78e2bd18ae785787f6a2',
                type: 'FullJsonSchemaValidator2021',
              },
              credentialSubject: {
                id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
              },
              expirationDate: '2020-05-17T07:07:40Z',
              id: 'urn:uuid:b6916c10-8b64-4428-8bf5-cdf48383310c',
              issuanceDate: '2020-05-17T07:07:40Z',
              issued: '2020-05-17T07:07:40Z',
              issuer: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
              type: ['VerifiableCredential', 'VerifiableAttestation'],
              validFrom: '2020-05-17T07:07:40Z',
              validUntil: '2020-05-17T07:07:40Z',
            },
          },
          {
            exp: 1589699260,
            iat: 1589699260,
            iss: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
            jti: 'urn:uuidbbf3921f-70f1-4b06-8670-bf4d5dcfca63',
            nbf: 1589699260,
            sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
            vc: {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              credentialSchema: {
                id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/0x23039e6356ea6b703ce672e7cfac0b42765b150f63df78e2bd18ae785787f6a2',
                type: 'FullJsonSchemaValidator2021',
              },
              credentialSubject: {
                id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
              },
              expirationDate: '2020-05-17T07:07:40Z',
              id: 'urn:uuid:bbf3921f-70f1-4b06-8670-bf4d5dcfca63',
              issuanceDate: '2020-05-17T07:07:40Z',
              issued: '2020-05-17T07:07:40Z',
              issuer: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
              type: ['VerifiableCredential', 'VerifiableAttestation'],
              validFrom: '2020-05-17T07:07:40Z',
              validUntil: '2020-05-17T07:07:40Z',
            },
          },
          {
            exp: 1589699260,
            iat: 1589699260,
            iss: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
            jti: 'urn:uuida4daba5e-dfb0-4f0b-8855-1c4d97eb24a2',
            nbf: 1589699260,
            sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
            vc: {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              credentialSchema: {
                id: 'https://api-pilot.ebsi.eu/trusted-schemas-registry/v2/schemas/0x23039e6356ea6b703ce672e7cfac0b42765b150f63df78e2bd18ae785787f6a2',
                type: 'FullJsonSchemaValidator2021',
              },
              credentialSubject: {
                id: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
              },
              expirationDate: '2020-05-17T07:07:40Z',
              id: 'urn:uuid:a4daba5e-dfb0-4f0b-8855-1c4d97eb24a2',
              issuanceDate: '2020-05-17T07:07:40Z',
              issued: '2020-05-17T07:07:40Z',
              issuer: 'did:ebsi:zvHWX359A3CvfJnCYaAiAde',
              type: ['VerifiableCredential', 'VerifiableAttestation'],
              validFrom: '2020-05-17T07:07:40Z',
              validUntil: '2020-05-17T07:07:40Z',
            },
          },
        ],
        verifiableCredentials: [
          {
            format: CredentialFormat.JWT,
            verifiableCredential:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYjY5MTZjMTAtOGI2NC00NDI4LThiZjUtY2RmNDgzODMzMTBjIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDpiNjkxNmMxMC04YjY0LTQ0MjgtOGJmNS1jZGY0ODM4MzMxMGMiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.EGsE1YXC_ZrJDBccqtafyJ-hmy6yQq9ynnYLg-ppP5dGnBMusLzgZbSXrawND61kAEs0jCc_cBb9nsH2GveMww',
          },
          {
            format: CredentialFormat.JWT,
            verifiableCredential:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYmJmMzkyMWYtNzBmMS00YjA2LTg2NzAtYmY0ZDVkY2ZjYTYzIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDpiYmYzOTIxZi03MGYxLTRiMDYtODY3MC1iZjRkNWRjZmNhNjMiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.surXIU-j6OISSjwR9gm5HVrwViJYtSdCEhJye_d6mHoCInMEoWxjH45IxtEHDIeM3IrrW8b2f4Sz-CeBeIwNow',
          },
          {
            format: CredentialFormat.JWT,
            verifiableCredential:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYTRkYWJhNWUtZGZiMC00ZjBiLTg4NTUtMWM0ZDk3ZWIyNGEyIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDphNGRhYmE1ZS1kZmIwLTRmMGItODg1NS0xYzRkOTdlYjI0YTIiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.PICCZWB6p5zQoxVJOft1yQSOFoTgpS8qWTP3CtgQ7HBHStTSnTIeljgqPZivGlsa9R-AnZfSmplpi1w_m_eYQQ',
          },
        ],
        decodedVerifiablePresentation: {
          aud: 'https://my.verifier.com/client_id',
          exp: 1589699260,
          iat: 1589699260,
          iss: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
          jti: 'urn:uuid:0706061a-e2ca-4614-9de7-9c1451935f02',
          nbf: 1589699260,
          nonce: 'FgkeErf91kfl',
          sub: 'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
          vp: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            holder:
              'did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbsEYvdrjxMjQ4tpnje9BDBTzuNDP3knn6qLZErzd4bJ5go2CChoPjd5GAH3zpFJP5fuwSk66U5Pq6EhF4nKnHzDnznEP8fX99nZGgwbAh1o7Gj1X52Tdhf7U4KTk66xsA5r',
            id: 'urn:uuid:0706061a-e2ca-4614-9de7-9c1451935f02',
            type: ['VerifiablePresentation'],
            verifiableCredential: [
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYjY5MTZjMTAtOGI2NC00NDI4LThiZjUtY2RmNDgzODMzMTBjIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDpiNjkxNmMxMC04YjY0LTQ0MjgtOGJmNS1jZGY0ODM4MzMxMGMiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.EGsE1YXC_ZrJDBccqtafyJ-hmy6yQq9ynnYLg-ppP5dGnBMusLzgZbSXrawND61kAEs0jCc_cBb9nsH2GveMww',
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYmJmMzkyMWYtNzBmMS00YjA2LTg2NzAtYmY0ZDVkY2ZjYTYzIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDpiYmYzOTIxZi03MGYxLTRiMDYtODY3MC1iZjRkNWRjZmNhNjMiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.surXIU-j6OISSjwR9gm5HVrwViJYtSdCEhJye_d6mHoCInMEoWxjH45IxtEHDIeM3IrrW8b2f4Sz-CeBeIwNow',
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiIsImtpZCI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlI0YwcjVPeXRfbGFodnZ6Nk1XbFlzM21jWU5LWmlpUWRVZnF2OHRzaEhOOXcifQ.eyJpc3MiOiJkaWQ6ZWJzaTp6dkhXWDM1OUEzQ3ZmSm5DWWFBaUFkZSIsInN1YiI6ImRpZDprZXk6ejJkbXpEODFjZ1B4OFZraTdKYnV1TW1GWXJXUGdZb3l0eWtVWjNleXFodDFqOUtic0VZdmRyanhNalE0dHBuamU5QkRCVHp1TkRQM2tubjZxTFpFcnpkNGJKNWdvMkNDaG9QamQ1R0FIM3pwRkpQNWZ1d1NrNjZVNVBxNkVoRjRuS25IekRuem5FUDhmWDk5blpHZ3diQWgxbzdHajFYNTJUZGhmN1U0S1RrNjZ4c0E1ciIsImlhdCI6MTU4OTY5OTI2MCwibmJmIjoxNTg5Njk5MjYwLCJleHAiOjE1ODk2OTkyNjAsImp0aSI6InVybjp1dWlkYTRkYWJhNWUtZGZiMC00ZjBiLTg4NTUtMWM0ZDk3ZWIyNGEyIiwidmMiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaWQiOiJ1cm46dXVpZDphNGRhYmE1ZS1kZmIwLTRmMGItODg1NS0xYzRkOTdlYjI0YTIiLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVmVyaWZpYWJsZUF0dGVzdGF0aW9uIl0sImlzc3VlciI6ImRpZDplYnNpOnp2SFdYMzU5QTNDdmZKbkNZYUFpQWRlIiwiaXNzdWFuY2VEYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJ2YWxpZEZyb20iOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsInZhbGlkVW50aWwiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImV4cGlyYXRpb25EYXRlIjoiMjAyMC0wNS0xN1QwNzowNzo0MFoiLCJpc3N1ZWQiOiIyMDIwLTA1LTE3VDA3OjA3OjQwWiIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiZGlkOmtleTp6MmRtekQ4MWNnUHg4VmtpN0pidXVNbUZZcldQZ1lveXR5a1VaM2V5cWh0MWo5S2JzRVl2ZHJqeE1qUTR0cG5qZTlCREJUenVORFAza25uNnFMWkVyemQ0Yko1Z28yQ0Nob1BqZDVHQUgzenBGSlA1ZnV3U2s2NlU1UHE2RWhGNG5Lbkh6RG56bkVQOGZYOTluWkdnd2JBaDFvN0dqMVg1MlRkaGY3VTRLVGs2NnhzQTVyIn0sImNyZWRlbnRpYWxTY2hlbWEiOnsiaWQiOiJodHRwczovL2FwaS1waWxvdC5lYnNpLmV1L3RydXN0ZWQtc2NoZW1hcy1yZWdpc3RyeS92Mi9zY2hlbWFzLzB4MjMwMzllNjM1NmVhNmI3MDNjZTY3MmU3Y2ZhYzBiNDI3NjViMTUwZjYzZGY3OGUyYmQxOGFlNzg1Nzg3ZjZhMiIsInR5cGUiOiJGdWxsSnNvblNjaGVtYVZhbGlkYXRvcjIwMjEifX19.PICCZWB6p5zQoxVJOft1yQSOFoTgpS8qWTP3CtgQ7HBHStTSnTIeljgqPZivGlsa9R-AnZfSmplpi1w_m_eYQQ',
            ],
          },
        },
      },
    });
  });
});
