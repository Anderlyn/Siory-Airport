# Configuración de Flask
import flask
from flask import request, jsonify 
from flask_cors import CORS
app = flask.Flask(__name__)

# Configuración de las Peticiones de Origen Cruzado 
CORS(app) # Habilita peticiones de diferente cliente

# Librerías importantes
import random # Librería para generar numero random
from datetime import datetime # Librería para la fecha y hora del sistema

# Clases
class Tiquete:
  def __init__(this, asientos_economicos, asientos_ejecutivos, *asientos):
    this.precio = 0
    this.asientos_economicos = asientos_economicos # Cantidad de asientos económicos comprados 
    this.asientos_ejecutivos = asientos_ejecutivos # Cantidad de asientos ejecutivos comprado
    this.asientos = asientos  # Lista de los números de los asientos comprados
    # Método para calcular el precio
  def MostrarPrecio(this, precio_eco, precio_eje): 
    this.precio = (this.asientos_economicos*precio_eco) + \
        (this.asientos_ejecutivos*precio_eje)
    return this.precio
class Avion:
    def __init__(this, cantidad_eco, cantidad_eje, precio_eco, precio_eje):
        this.cantidad_eco = cantidad_eco
        this.cantidad_eje = cantidad_eje
        this.precio_eco = precio_eco
        this.precio_eje = precio_eje
        # Asientos en el avión
        this.espacios_eco = {}
        this.espacios_eje = {}
        # Llena los asientos inicialmente como libres
        for i in range(0, cantidad_eco):
            this.espacios_eco[str(i)] = "free"
        for i in range(0, cantidad_eje):
            this.espacios_eje[str(i)] = "free"

    # Función para randomizar el asiento en base al tipo
    def RandomizarAsiento(this, tipo):
        if tipo == "economico":
            if "free" in this.espacios_eco.values(): # Si existe espacio libre, genera el numero random
                random_eco = random.randint(0, this.cantidad_eco-1) # Genera un número random
                if this.espacios_eco[str(random_eco)] == "free": # Si este está libre, lo utiliza para devolverlo como asiento. 
                    return random_eco
                else:
                    return this.RandomizarAsiento(tipo) # Si no está libre, de manera recursiva se vuelve a llamar hasta que devuelva el espacio vació
            else: # Si no existe espacio libre, devuleve -1 para indicar que ya no hay espacios en este tipo
                return (-1)
        elif tipo == "ejecutivo":
            if "free" in this.espacios_eje.values():
                random_eje = random.randint(0, this.cantidad_eje-1)
                if this.espacios_eje[str(random_eje)] == "free":
                    return random_eje
                else:
                    return this.RandomizarAsiento(tipo)
            else:
                return(-1)

# Datos Iniciales
avion_1  = Avion(20, 10, 120, 250) # Avión genérico inicial
compras = [] # Historial de los asientos comprados

# Rutas de la API

# Ruta para devolver la hora
@app.route('/api/hora', methods=['GET'])
def hora():
    presente = datetime.now() # Se obtiene la fecha y hora actual
    return presente.strftime("%d/%m/%Y"+" - "+"%H:%M") # Se devuelve la fecha y hora con un formato establecido. 

# Ruta para completar la compra y generar el recibo
@app.route('/api/comprar', methods=['GET'])
def comprar():
    # Variables para contar cuantas compras de cada uno hubo
    recibo_eco = 0
    recibo_eje = 0
    # Diccionario para guardar el numero de asiento comprado
    asientos_compra = {
        "economicos": [],
        "ejecutivos": []
    }
    for llave, value in avion_1.espacios_eco.items():
        if value == "selected":
            avion_1.espacios_eco[llave] = "used" # Pone el asiento que estaba seleccionado en usado
            asientos_compra['economicos'].append(llave) # Agrega el numero de asiento a la lista de los asientos seleccionados
            recibo_eco += 1 # Aumenta en uno la cantidad de tiquetes por el tipo económico comprado
    for llave, value in avion_1.espacios_eje.items():
        if value == "selected":
            avion_1.espacios_eje[llave] = "used"
            asientos_compra['ejecutivos'].append(llave)
            recibo_eje += 1
    recibo = Tiquete(recibo_eco, recibo_eje, asientos_compra, len(compras)+1) # Crea la instancia del recibo
    compras.append(recibo) # Guarda el recibo en la variable global compras
    # Devuelve un diccionario en forma de JSON con datos necesarios para la factura
    return jsonify({
            'total': recibo.MostrarPrecio(avion_1.precio_eco, avion_1.precio_eje),
            'economicos': recibo.asientos_economicos,
            'ejecutivos': recibo.asientos_ejecutivos,
            'total_ejecutivo': recibo_eje*avion_1.precio_eje,
            'total_economico': recibo_eco*avion_1.precio_eco,
            'tiquetes': recibo.asientos,
            'id': len(compras)+1
        })

# Ruta para limpiar los seleccionados
@app.route('/api/salir', methods=['GET'])
def salir():
    # Limpian los campos que estaban seleccionados y los devuelve a libre.
    for i in range(0, avion_1.cantidad_eco):
        if avion_1.espacios_eco[str(i)] == "selected":
            avion_1.espacios_eco[str(i)] = "free"
    for i in range(0, avion_1.cantidad_eje):
        if avion_1.espacios_eje[str(i)] == "selected":
            avion_1.espacios_eje[str(i)] = "free"
    return "exito"

# Ruta para devolver los asientos
@app.route('/api/asientos', methods=['GET'])
def asientos():
    # Devuelve los asientos y sus estados
    return {
        'espacios_eje': avion_1.espacios_eje,
        'espacios_eco': avion_1.espacios_eco,
    }

# Ruta para generar una selección de un asiento
@app.route('/api/seleccionar', methods=['POST'])
def seleccionar():
    # Saca la clase de boleto de la petición
    data = request.get_json()
    # La variable estado permite al cliente saber cómo fue la selección
    estado = "" 
    # Diccionario para guardar el numero de asiento comprado
    asientos_compra = {
        "economicos": [],
        "ejecutivos": []
    }
    # Genera el asiento aleatorio dependiendo de la clase clickeada en el cliente. 
    if data['tipo'] == "economico":
        asiento_disponible_eco = avion_1.RandomizarAsiento(data['tipo']) # Genera un asiento random de los disponibles en económico
        if asiento_disponible_eco != -1: # Si el método RandomizarAsiento devolvió -1, no hay asientos disponibles.
            avion_1.espacios_eco[str(asiento_disponible_eco)] = "selected"
            estado = "exito" 
        else:
            estado = "fallido" # Este estado permite saber al cliente que ya no hay este tipo de asientos
    elif data['tipo'] == "ejecutivo":
        asiento_disponible_eje = avion_1.RandomizarAsiento(data['tipo'])
        if asiento_disponible_eje != -1:
            avion_1.espacios_eje[str(asiento_disponible_eje)] = "selected"
            estado = "exito"
        else:
            estado = "fallido"

    # Variables para contar cuantas compras de cada uno hubo
    recibo_eco = 0
    recibo_eje = 0
    # Aumenta en uno la cantidad de tiquetes por el tipo económico o ejecutivo comprado.
    for llave, value in avion_1.espacios_eco.items():
        if value == "selected":
            asientos_compra['economicos'].append(llave)
            recibo_eco += 1
    for llave, value in avion_1.espacios_eje.items():
        if value == "selected":
            asientos_compra['ejecutivos'].append(llave)
            recibo_eje += 1
    # Crea una instancia de Tiquete temporal y pasajera para utilizarla en la respuesta
    recibo = Tiquete(recibo_eco, recibo_eje) # Usa solo 2 parametros porque es un tiquete temporal
    # Devolvemos la información necesaria para que el cliente actualice la vista. 
    return jsonify({
    'cantidad_eco': avion_1.cantidad_eco, 
    'cantidad_eje': avion_1.cantidad_eje, 
    'espacios_eje': avion_1.espacios_eje,
    'espacios_eco': avion_1.espacios_eco, 
    'recibo': {
        'total': recibo.MostrarPrecio(avion_1.precio_eco, avion_1.precio_eje),
        'economicos': recibo.asientos_economicos,
        'ejecutivos': recibo.asientos_ejecutivos
    },
    'estado': estado,
    'asientos': asientos_compra
    })

# Inicio del servidor
app.run()
