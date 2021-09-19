const parse = require("pg-connection-string").parse;
const { Pool } = require("pg");
const prompt = require("prompt");
const { v4: uuidv4 } = require("uuid");

var accountValues = Array(3);

// Wrapper for a transaction.  This automatically re-calls the operation with
// the client as an argument as long as the database server asks for
// the transaction to be retried.
async function retryTxn(n, max, client, operation, callback, args) {
  await client.query("BEGIN;");
  while (true) {
    n++;
    if (n === max) {
      throw new Error("Max retry count reached.");
    }
    try {
      const value = await operation(client, callback, args);
      await client.query("COMMIT;");
      return value; 
    } catch (err) {
      if (err.code !== "40001") {
        return callback(err);
      } else {
        console.log("Transaction failed. Retrying transaction.");
        console.log(err.message);
        await client.query("ROLLBACK;", () => {
          console.log("Rolling back transaction.");
        });
        await new Promise((r) => setTimeout(r, 2 ** n * 1000));
      }
    }
  }
}


// Run the transactions in the connection pool
(async () => {
  
    var connectionString = 'postgresql://shaoa182739081729371:Viva12345678@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&sslrootcert=/Users/andrewshao/.postgresql/root.crt&options=--cluster%3Dsuper-deer-3433'  
    var config = parse(connectionString);
    config.port = 26257;
    config.database = "defaultdb";
    const pool = new Pool(config);

    // Connect to database
    var client = await pool.connect();
    var callback = cb ;
    var n = 0; 
    var nx = 15; 
 
    // PERSON EXISTS 
    async function _personExists(client, callback, args){
        const username = args['username']
        const selectBalanceStatement = `SELECT * FROM accounts WHERE username = "${username}";`;
        await client.query(selectBalanceStatement, callback, (err, res) => {
            return res.rows;
        });

    }
    async function personExists(username){
        args = {
            'username': username
       
        }
        return await retryTxn(n, nx, client, _personExists, callback, args);
    }

    
    // GET PERSON
    async function _getPerson(client, callback, args){
        const username = args['username']
        const password = args['password'] 
        const selectBalanceStatement = `SELECT * FROM accounts WHERE username = "${username}" AND password = "${password}";`;
        await client.query(selectBalanceStatement, callback, (err, res) => {
            return res.rows;
        });

    }
    async function getPerson(username, password){
        args = {
            'username': username,
            'password': password
        }
        return await retryTxn(n, nx, client, _getPerson, callback, args);
    }


    // ------------INSERT PERSON------------------
    async function _insertClient (client, callback, args) {
        const username = args['username']
        const password = args['password'] 
        const selectBalanceStatement = `INSERT INTO accounts(username, password, progress) VALUES ('${username}', '${password}', ${0})`;
        await client.query(selectBalanceStatement, callback);

      }
    async function InsertClient(username, password){
        if (personExists(username).length < 2){
            return false;
        }
        args = {
            'username': username,
            'password': password
        }
        return await retryTxn(n, nx, client, _insertClient, callback, args)
    }
    
    // --------- EXECUTESQL FUNCTIONS ------------------------
    async function _executeSQL(client, callback, SQL){
        // Returns the Response from the SQL 
        const selectBalanceStatement = SQL;
        await client.query(selectBalanceStatement, callback, (err, res) => {
            return res;
        });
    }
    async function executeSQL(SQL){
        return await retryTxn(n, nx, client, _executeSQL, callback, executeSQL)
    }

    async function _updateProgress(client, callback, args){
      const username = args['username'];
      const progress = args['progress'];
      const SQL = `UPDATE accounts SET progress = "${progress}" WHERE username "${username}"`;
      await client.query(selectBalanceStatement, callback);
    }
    async function updateProgress(username, progress){
      const args = {
        'username': username,
        'progress': progress      
      }
      return await retryTxn(n, nx, client, _updateProgress, callback, args)
    }

  // Callback
  function cb(err, res) {
    if (err) throw err;

    if (res.rows.length > 0) {
      console.log("New account balances:");
      res.rows.forEach((row) => {
        console.log(row);
      });
    }

    
    

}
 
})().catch((err) => console.log(err.stack));

