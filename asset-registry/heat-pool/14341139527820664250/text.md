# HEATpool.org
<small>Forging towards the sunset!</small>

HEATpool.org is the longest running HEAT staking pool, operating since December 2017. That was shortly after balance leasing was released as a feature on the HEAT blockchain. What started fully manually (with daily checks on rewards using Excel), was upgraded to an automated setup in October 2020. Leasing to HEATpool gives you the confidence that you don't have to worry about maintaining your forging node and (re-)registering as masternode when the POP awards expire.

## Payouts twice per day
The pool now uses a Python script, which processes payments twice per day. At the moment of payments, it checks the balance for all active lessors, and proportionally divides the rewards for the past 12 hours. This only happens after an initial check where the local server (localhost) completes a quick check on the blockchain data with the data from the heatwallet.com blockchain. This ensures that the chains are fully in sync prior to the payments.

## Pool fees
The total fee % at every payment is 1%, of which half will be paid to the node lottery account, and the other half to me to cover my expenses. The node lottery exists to provide some further incentive to operate your own nodes, even if you would not be forging.

## Support
In case you have any questions on the pool, reach out to me via the HEAT Discord channel.

Find us on the [HEAT block explorer](https://heatwallet.com/#/explorer-account/14341139527820664250/transactions).
