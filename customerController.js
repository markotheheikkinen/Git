'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password: '',
  port     : 3302,
  database: 'asiakas'
});

module.exports =
{
  fetchTypes: function (req, res) {
    connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
        //res.send(error);
        //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
        res.send({ "status": 500, "error": error, "response": null });
      }
      else {
        console.log("Data = " + JSON.stringify(results));
        res.json(results);
        //res.statusCode = 418;
        //res.send(results);
        //res.send({ "status": 768, "error": null, "response": results });
      }
    });

  },

  fetchAll: function (req, res) {    
    console.log("Body = " + JSON.stringify(req.body));
    console.log("Params = " + JSON.stringify(req.guery));
    var query = "SELECT avain, nimi, osoite, postinro, postitmp, luontipvm, asty_avain FROM asiakas WHERE 1=1";
    if (req.query.length != 0) {
      for (var key in req.query) {
        query += " AND " + key + " LIKE '" + req.query[key] + "%'";
      }
    }
    connection.query(query, function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
        res.send({ "status": 500, "error": error, "response": null });
      }
      else {
        res.json(results);
      }
    });
  },

  create: function (req, res) {
  /*
    for (const x in req.body) {
      if (req.body[x] == '') {
        virhe = true;
      }
    };
    if (virhe) {
      res.send({
        "status": 400,
        "error": "Kaikki kentät ovat pakollisia."
      });      
    } else {
    } 
  */  

    if (req.body.nimi == "" || req.body.osoite == "") {
      res.send({ "status": "NOT OK", "error": "Jokin kenttä on tyhjä tai syötit vääränlaista dataa" });
    }
    else {
      // Mieluummin ehkä näin kuin MySQL spesifisti INSERT INTO asiakas set ? rakenteella,
      // niin tätä voi käyttää muidenkin kantojen kanssa
      var sql = "INSERT INTO asiakas(NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) VALUES ('" + req.body.nimi + "', '" + req.body.osoite + "', '" + req.body.postinro + "', '" + req.body.postitmp + "', " + "CURDATE(), '" + req.body.asty_avain + "')";
      console.log("sql=" + sql);
      connection.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Virhe lisätessä asiakasta: " + error);
          res.send({ "status": "Jokin kenttä on tyhjä tai syötit vääränlaista dataa", "error": error, "response": null });
        }
        else {
          res.send({ "status": 200, "error": "" });
        }
      });
    }
  },

  update: function (req, res) {

  },

  delete: function (req, res) {
    // Client lähettää DELETE method:n
    
    let id = req.params.id;
    let sql = "DELETE FROM asiakas WHERE AVAIN = " + id;
    console.log(sql);

    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log("Virhe poistettaessa dataa Asiakas-taulusta, syy: " + error);
        res.send({
          "status":500,
          "error": error,
          "respons": null
        });
      } else{
        res.send(results);
      }
    });
  
 // console.log("Body = " + JSON.stringify(req.body));
 // console.log("Params = " + JSON.stringify(req.params));
  //  res.send("Kutsuttiin delete");
  }

}
