/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/vault_dapp.json`.
 */
export type VaultDapp = {
  address: '2HBN2FKDHHe88xMNBwkKm234Yyd86v3jzeBcQvcMc2Fm'
  metadata: {
    name: 'vaultDapp'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'deposit'
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182]
      accounts: [
        {
          name: 'owner'
          writable: true
          signer: true
        },
        {
          name: 'assetMint'
        },
        {
          name: 'userState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [117, 115, 101, 114, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'owner'
              },
            ]
          }
        },
        {
          name: 'vault'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 97, 117, 108, 116, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'owner'
              },
              {
                kind: 'arg'
                path: 'vaultId'
              },
            ]
          }
        },
        {
          name: 'userTokenAccount'
          writable: true
        },
        {
          name: 'vaultTokenAccount'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
      ]
      args: [
        {
          name: 'vaultId'
          type: 'u64'
        },
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
    {
      name: 'initialize'
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237]
      accounts: [
        {
          name: 'signer'
          writable: true
          signer: true
        },
        {
          name: 'userState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [117, 115, 101, 114, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'signer'
              },
            ]
          }
        },
        {
          name: 'vault'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'name'
          type: 'string'
        },
        {
          name: 'description'
          type: 'string'
        },
      ]
    },
    {
      name: 'lock'
      discriminator: [21, 19, 208, 43, 237, 62, 255, 87]
      accounts: [
        {
          name: 'owner'
          signer: true
        },
        {
          name: 'userState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [117, 115, 101, 114, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'owner'
              },
            ]
          }
        },
        {
          name: 'vault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 97, 117, 108, 116, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'owner'
              },
              {
                kind: 'arg'
                path: 'vaultId'
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'vaultId'
          type: 'u64'
        },
      ]
    },
    {
      name: 'transfer'
      discriminator: [163, 52, 200, 231, 140, 3, 69, 186]
      accounts: [
        {
          name: 'oldOwner'
          writable: true
          signer: true
        },
        {
          name: 'oldUserState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [117, 115, 101, 114, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'oldOwner'
              },
            ]
          }
        },
        {
          name: 'oldVault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 97, 117, 108, 116, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'oldOwner'
              },
              {
                kind: 'arg'
                path: 'vaultId'
              },
            ]
          }
        },
        {
          name: 'newOwner'
        },
        {
          name: 'newUserState'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [117, 115, 101, 114, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'newOwner'
              },
            ]
          }
        },
        {
          name: 'newVault'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
      ]
      args: [
        {
          name: 'vaultId'
          type: 'u64'
        },
      ]
    },
    {
      name: 'unlock'
      discriminator: [101, 155, 40, 21, 158, 189, 56, 203]
      accounts: [
        {
          name: 'owner'
          signer: true
        },
        {
          name: 'userState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [117, 115, 101, 114, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'owner'
              },
            ]
          }
        },
        {
          name: 'vault'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 97, 117, 108, 116, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'owner'
              },
              {
                kind: 'arg'
                path: 'vaultId'
              },
            ]
          }
        },
      ]
      args: [
        {
          name: 'vaultId'
          type: 'u64'
        },
      ]
    },
    {
      name: 'withdraw'
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34]
      accounts: [
        {
          name: 'owner'
          signer: true
        },
        {
          name: 'assetMint'
        },
        {
          name: 'userState'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [117, 115, 101, 114, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'owner'
              },
            ]
          }
        },
        {
          name: 'vault'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 97, 117, 108, 116, 95, 115, 116, 97, 116, 101]
              },
              {
                kind: 'account'
                path: 'owner'
              },
              {
                kind: 'arg'
                path: 'vaultId'
              },
            ]
          }
        },
        {
          name: 'userTokenAccount'
          writable: true
        },
        {
          name: 'vaultTokenAccount'
          writable: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'tokenProgram'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
      ]
      args: [
        {
          name: 'vaultId'
          type: 'u64'
        },
        {
          name: 'amount'
          type: 'u64'
        },
        {
          name: 'bump'
          type: 'u8'
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'userState'
      discriminator: [72, 177, 85, 249, 76, 167, 186, 126]
    },
    {
      name: 'vaultState'
      discriminator: [228, 196, 82, 165, 98, 210, 235, 152]
    },
  ]
  errors: [
    {
      code: 6000
      name: 'invalidVaultName'
      msg: 'Name should be less than 32 characters'
    },
    {
      code: 6001
      name: 'invalidVault'
      msg: 'Invalid vault_id'
    },
    {
      code: 6002
      name: 'invalidVaultDescription'
      msg: 'Description should be less than 128 characters'
    },
    {
      code: 6003
      name: 'vaultCountOverflow'
      msg: 'Maximum number of vaults reached for this user'
    },
    {
      code: 6004
      name: 'vaultCountUnderflow'
      msg: 'Vault count underflow'
    },
    {
      code: 6005
      name: 'invalidAmount'
      msg: 'Invalid Amount'
    },
    {
      code: 6006
      name: 'vaultLocked'
      msg: 'Vault is Locked'
    },
    {
      code: 6007
      name: 'vaultAlreadyUnlocked'
      msg: 'Vault is already unlocked'
    },
    {
      code: 6008
      name: 'vaultAlreadyLocked'
      msg: 'Vault is already locked'
    },
  ]
  types: [
    {
      name: 'userState'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'owner'
            type: 'pubkey'
          },
          {
            name: 'vaultCount'
            type: 'u64'
          },
        ]
      }
    },
    {
      name: 'vaultState'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'owner'
            type: 'pubkey'
          },
          {
            name: 'isLocked'
            type: 'bool'
          },
          {
            name: 'createdAt'
            type: 'i64'
          },
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'description'
            type: 'string'
          },
        ]
      }
    },
  ]
}
