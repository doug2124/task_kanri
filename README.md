# Task Management App

## 概要

Node.js、Docker、DynamoDB を利用したタスク管理アプリです。現在は EC2 上で Docker コンテナとして実行し、DynamoDB にタスク情報を保存しています。

---

## ローカル実行（会社PC）

### バックエンド起動

```cmd
C:\Users\TakayukiYD\node\node-v24.22.1-win-x64\node.exe server.js
```

### AWS認証情報

AWS Access Key、Secret Access Key、Session Token は定期的に更新すること。

---

## DynamoDB設定

### 必要パッケージ

```cmd
C:\Users\TakayukiYD\node\node-v24.22.1-win-x64\npm.cmd install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

### テーブル設定

テーブル名

```text
Tasks
```

パーティションキー

```text
userId
```

ソートキー

```text
goalId
```

---

## EC2接続

AWSコンソールから EC2 に接続する場合は以下のいずれかが必要。

- パブリック IP を持つ EC2
- EC2 Instance Connect Endpoint (EICE)

---

## EC2でDocker実行

### Dockerインストール

```bash
sudo dnf update -y
sudo dnf install docker -y

sudo systemctl start docker
sudo systemctl enable docker
```

### Docker権限付与

```bash
sudo usermod -aG docker ec2-user
```

再ログイン後確認

```bash
docker ps
```

---

## Gitインストール

```bash
sudo dnf install git -y
```

### リポジトリ取得

```bash
git clone <repository-url>
cd task_kanri
```

---

## 必要ファイル

起動前に以下のファイルを用意する。

```text
secrets.js
Dockerfile
```

---

## Dockerイメージ作成

```bash
docker build -t task-manager .
```

---

## コンテナ再作成

古いコンテナを停止・削除

```bash
docker stop task-app
docker rm task-app
```

新しいコンテナを起動

```bash
docker run -d -p 3000:3000 --name task-app task-manager
```

---

## 動作確認

### API確認

```bash
curl http://localhost:3000/api/tasks
```

正常時

```json
[]
```

または保存済みタスク一覧が返却される。

### ブラウザ確認

```text
http://<EC2-Public-IP>:3000
```

---

## 発生したトラブルと解決方法

### 1. ResourceNotFoundException

原因

```text
DynamoDB のテーブル名がコードと一致していなかった
```

解決

```text
テーブル名を Tasks に統一
```

---

### 2. Cannot GET /

原因

```text
frontend フォルダが Docker コンテナにコピーされていなかった
```

解決

```text
Dockerfile を修正し frontend をコンテナへコピー
```

---

### 3. Failed to load resource / ERR_CONNECTION_REFUSED

原因

```javascript
fetch("http://localhost:3000/api/...")
```

を利用していたため。

EC2にデプロイ後、ブラウザの localhost は利用者自身のPCを指してしまう。

解決

```javascript
fetch("/api/...")
```

のように相対パスを利用する。

---

### 4. Failed to retrieve tasks

原因

```text
DynamoDB テーブルの設定不備
```

確認事項

- テーブル名
- パーティションキー
- ソートキー
- AWS認証情報

---

## 現在の構成

```text
Internet
    |
    v
EC2 (Amazon Linux 2023)
    |
    +-- Docker
            |
            +-- Node.js Backend
            +-- Frontend
            |
            +-- DynamoDB (Tasks)
```

---

## 今後の予定

現在はタスクの保存・取得まで実装済み。

次に実装したい機能：

```text
他ユーザーとのタスク共有機能
```

候補：

- goalId を共有URLとして利用
- 共有ユーザー管理テーブル追加
- DynamoDBで共有権限管理