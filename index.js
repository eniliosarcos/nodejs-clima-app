require('dotenv').config();

const colors = require('colors');
const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() => {

    const busquedas = new Busquedas();
    let opt;

    do {

        opt = await inquirerMenu();

        switch (opt) {

            case 1:
                // mostrar mensaje
                const termino = await leerInput('Que lugar desea buscar? :');
                
                // buscar los lugar
                const lugares = await busquedas.ciudad(termino);
                
                // seleccionar el lugar
                const idSeleccionado = await listarLugares(lugares);

                if(idSeleccionado === '0') continue;

                
                const lugarSeleccionado = lugares.find(l => l.id === idSeleccionado);

                //guardar en db
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                // clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);

                // mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre.green);
                console.log('lat:', lugarSeleccionado.lat);
                console.log('lng:', lugarSeleccionado.lng);
                console.log('temperatura:', clima.temp );
                console.log('minima:', clima.min);
                console.log('maxima:', clima.max);
                console.log('Como esta el clima:', clima.desc.green);
                break;

            case 2:
                busquedas.historialCapitalizados.forEach((lugar,i) => {

                    const index = `${i +1}.`.green;
                    console.log(`${index} ${lugar}`)
                })
                break
        
        }

        if(opt !== 0) await pausa();
        
    } while (opt !== 0);
}


main();