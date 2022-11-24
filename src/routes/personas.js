const express = require("express");
const router = express.Router();
const sql = require('mssql');
const config = require('../config')

router.get('/listadoPersonas', async (req, res) => {
    let pool = await sql.connect(config);
    pool.query('SELECT* FROM Usuario', (error, results, fields) => {
        if (error) {
            console.log(error);
            res.send({
                'code': 400,
                'failed': 'Error ocurrido',
            });
        } else {
            res.render('personas/listadoPersonas', { data: results.recordset });
        }
    });
});

router.get('/insertarPersonas', (req, res) => {
    res.render('personas/insertarPersonas');
});

router.post('/insertarPersonas', async (req, res) => {
    const { cedula, nombre, apellido, celular, ciudad } = req.body;
    if (cedula == null || nombre == null || apellido == null || celular == null || ciudad == null || nombre == "" || apellido == "" || celular == "" || ciudad == "") {
        return res.redirect('/insertarPersonas');
    }
    let pool = await sql.connect(config);
    var query = "INSERT INTO Usuario (cedula, nombre, apellido, celular, ciudad) VALUES ('" + cedula + "','" + nombre + "','" + apellido + "','" + celular + "','" + ciudad + "')";
    pool.request().query(query);
    res.redirect('/mensajePersonas');
});

router.get('/mensajePersonas', async (req, res) => {
    res.render('personas/MensajePersonas')
})

router.get('/eliminar/:cedula', async (req, res) => {
    const { cedula } = req.params;
    let pool = await sql.connect(config);
    var query = "DELETE FROM Usuario WHERE cedula='" + cedula + "'";
    pool.request().query(query);
    res.redirect('/listadoPersonas');
});

router.get('/editar/:cedula', async (req, res) => {
    const { cedula } = req.params;
    let pool = await sql.connect(config);
    pool.query("SELECT* FROM Usuario WHERE cedula='" + cedula + "'", (error, results, fields) => {
        if (error) {
            console.log(error);
            res.send({
                'code': 400,
                'failed': 'Error ocurrido'
            });
        } else {
            res.render('personas/editarPersonas', { data: results.recordset[0] });
        }
    });
});

router.post('/editarPersonas/:cedula', async (req, res) => {

    const pool = await sql.connect(config);
    const { cedula } = req.params;
    const { nombre, apellido, celular, ciudad } = req.body;
    var query = "UPDATE Usuario SET nombre ='" + nombre + "',apellido='" + apellido + "',celular='" + celular + "',ciudad='" + ciudad + "' WHERE cedula='" + cedula + "'";
    pool.request().query(query);
    res.redirect('/listadoPersonas');
});
module.exports = router;    