# Aries Mobile Agent React Native

### Import and Export feature

This feature is available in `aries-framework-javascript @ 0.2.0-alpha.88` and `indy-sdk-react-native @ 0.2.0` so this code contains the aforementioned versions of package.

### Export Wallet

```
const backupKey = 'backupkey'
const random = Math.floor(Math.random() * 100000)
const backupWalletName = `backup-${random}`

const path1 = `${RNFS.ExternalStorageDirectoryPath}/${backupWalletName}`
await newAgent.wallet.export({ path: path1, key: backupKey })
```

### Import Wallet

```
const newAgent = new Agent(
        {
          label: 'Aries Bifold',
          mediatorConnectionsInvite: Config.MEDIATOR_URL,
          mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
          walletConfig: { id: 'wallet4', key: '123' },
          autoAcceptConnections: true,
          autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
          logger: new ConsoleLogger(LogLevel.trace),
          indyLedgers,
          connectToIndyLedgersOnStartup: false,
        },
        agentDependencies
      )

       const imp = await newAgent.wallet.import(
         { id: 'wallet4', key: '123' },
          { path: `/data/user/0/com.ariesbifold/files/backup-2679`, key: 'someBackupKey' }
         { path: `/storage/emulated/0/backup-7693`, key: 'someBackupKey' }
       )
       await newAgent.wallet.initialize({ id: 'wallet4', key: '123' })
```