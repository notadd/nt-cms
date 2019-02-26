## 安装node.js

<details>
<summary>Windows</summary>

1. [点击下载 Node.js](https://npm.taobao.org/mirrors/node/v10.15.1/node-v10.15.1-x64.msi)
2. 安装Node.js

Powershell/CMD 可以打印出这个说明安装成功。（部分系统需要重启后环境变量才生效）

```
>> node -v
v10.15.1
>> npm -v
6.4
```
</details>

<details>
<summary>Macos</summary>

1. [点击下载 Node.js](https://npm.taobao.org/mirrors/node/v10.15.1/node-v10.15.1.pkg)
2. 安装Node.js

打印出这个说明安装成功。（部分系统需要重启后环境变量才生效）
```
>> node -v
v10.15.1
>> npm -v
6.4
```
</details>


<details>
<summary>Ubuntu/Debian （支持ARM及X86平台）</summary>

```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```
终端可以打出以下信息说明安装成功：
```
$ node -v
v10.15.1
$ npm -v
6.4
```
</details>

<details>
<summary>Centos/Redhat/Fedora （支持X86平台）</summary>

```
curl -sL https://rpm.nodesource.com/setup_10.x | bash -
```
终端可以打出以下信息说明安装成功：
```
$ node -v
v10.15.1
$ npm -v
6.4
```
</details>

<details>
<summary>使用 NVM 安装（支持 所有 Linux 及 Raspbian ，支持多版本管理）</summary>

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

```
如果没 curl ，可以使用 wget 安装
```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
```
使用 NVM 安装nodejs ：
```
nvm install --lts
```
终端可以打出以下信息说明安装成功：
```
$ node -v
v10.15.1
$ npm -v
6.4
```
</details>

<details>
<summary>使用 snap 安装（支持 所有 Linux ）</summary>

```
sudo snap install node --classic --channel=10

```
（如果提示 snap 不存在，请先安装 snapd）
终端可以打出以下信息说明安装成功：
```
$ node -v
v10.15.1
$ npm -v
6.4
```
</details>








