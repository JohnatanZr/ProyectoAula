const express = require("express");
const router = express.Router();
const sql = require('mssql');
const config = require('../config')

router.get('/listadoEmpleados', async (req, res) => {
    let pool = await sql.connect(config);
    pool.query('SELECT* FROM Empleado', (error, results, fields) => {
        if (error) {
            console.log(error);
            res.send({
                'code': 400,
                'failed': 'Error ocurrido',
            });
        } else {
            res.render('personas/listadoEmpleados', { data: results.recordset});
        }
    });
});

router.get('/insertarEmpleados', (req, res) => {
    res.render('personas/insertarEmpleados');
});

router.post('/insertarEmpleados', async (req, res) => {
    const { cedula, nombre, apellido, celular } = req.body;
    if (cedula == null || nombre == null || apellido == null || celular == null || nombre == "" || apellido == "" || celular == "") {
        return res.redirect('/insertarEmpleados');
    }
    let pool = await sql.connect(config);
    var query = "INSERT INTO Empleado (cedula, nombre, apellido, celular) VALUES ('" + cedula + "','" + nombre + "','" + apellido + "','" + celular + "')";
    pool.request().query(query);
    res.redirect('/mensajeEmpleado');
});

router.get('/mensajeEmpleado', async (req, res) => {
    res.render('personas/mensajeEmpleado')
});

router.get('/eliminarEmpleado/:cedula', async (req, res) => {
    const { cedula } = req.params;
    let pool = await sql.connect(config);
    var query = "DELETE FROM Empleado WHERE cedula='" + cedula + "'";
    pool.request().query(query);
    res.redirect('/listadoEmpleados');
});

router.get('/editarEmpleado/:cedula', async (req, res) => {
    const { cedula } = req.params;
    let pool = await sql.connect(config);
    pool.query("SELECT* FROM Empleado WHERE cedula='" + cedula + "'", (error, results, fields) => {
        if (error) {
            console.log(error);
            res.send({
                'code': 400,
                'failed': 'Error ocurrido'
            });
        } else {
            res.render('personas/editarEmpleados', { data: results.recordset[0] });
        }
    });
});

router.post('/editarEmpleados/:cedula', async (req, res) => {
    const pool = await sql.connect(config);
    const { cedula } = req.params;
    const { nombre, apellido, celular, ciudad } = req.body;
    var query = "UPDATE Empleado SET nombre ='" + nombre + "',apellido='" + apellido + "',celular='" + celular +"' WHERE cedula='" + cedula + "'";
    pool.request().query(query);
    res.redirect('/listadoEmpleados');
});
module.exports = router;