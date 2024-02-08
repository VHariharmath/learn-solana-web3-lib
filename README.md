# Solana Study material to interact with Solana web3 library

## Steps to prepare the development environment

### Installing nodejs

1. Prefer linux/mac system for development. If you are on windows install WSL - https://learn.microsoft.com/en-us/windows/wsl/install

```
WSL: Windows Subystem for Linux. This is a light weight ubuntu/other flavours on windows, gives Linux enviroment without installing linux VM. After installation, open WSL terminal and continue the next steps
```

2. Install NVM: Node Version Manager from here - https://github.com/nvm-sh/nvm

3. install nodejs - # nvm install 20.10.0 - Please prefer this version as few operations are deprecared on node > v21.0

### Fork this repository and set the upstream

```
git remote add upstream git@github.com:VHariharmath/learn-solana-web3-lib.git
```

### Install dependencies (package.json has all dependencies listed)

```
cd learn-solana-web3-lib.git
npm install
```
