# OSLabID - ID Card for OS Lab Members

## Introduction

OSLabID is a smart card designed for both online and offline authentication of OS Lab members. The project aims to implement a more secure and efficient authentication system, moving beyond traditional simple authentication methods.

## Technical Overview

It improves upon the traditional method of simply comparing UID bytes of the Mifare Classic chipset by implementing an encrypted authentication logic using a smart card. Specifically, it employs the AES-128 encryption API and the Random byte API provided by the Javacard 3.0.5 platform to execute a simple challenge-response mechanism.

## Key Features

- **Enhanced Security**: Authentication based on encryption rather than simple UID comparison
- **Multi-Platform Support**: Usable both online and offline
- **Scalability**: Can be integrated with various lab systems
- **User-Friendly Interface**: Simple tap-based authentication

## Implementation Details

The smart card is implemented based on the Javacard 3.0.5 platform, and follows the authentication procedure between the card and the reader as follows:

1. The reader generates a random challenge and sends it to the card
2. The card encrypts the challenge using its embedded secret key
3. The encrypted response is sent back to the reader
4. The reader verifies the response using the same secret key

This approach effectively prevents simple ID cloning and strengthens security against man-in-the-middle attacks.

## Future Plans

- Integration with biometric technologies
- Virtual card support through mobile apps
- Refinement of permission levels and access control

## Detailed Information

For technical details and implementation guides, please visit our [GitHub repository](https://github.com/OS-LAB-DaejinUniv/Smart-Lab/blob/main/smartcard/README.md).
