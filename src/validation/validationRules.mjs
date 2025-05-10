    import mongoose from 'mongoose';
    import { body, param } from 'express-validator';
    import { validationResult } from 'express-validator';


    // Middleware de validación 
    // ----------  AGREGAR, EDITAR ----- //
    export async function Middleware(req, res, next) {
        // Ejecuta las validaciones
        await Promise.all([
            // Validación para pais (official)
            body('official')
                .trim()
                .notEmpty().withMessage('El nombre del país es requerido')
                .isLength({ min: 3, max: 90 }).withMessage('El nombre del país debe tener entre 3 y 90 caracteres')
                .run(req),

            // Validación para capital
            body('capital')
                .trim()
                .notEmpty().withMessage('El nombre de la capital es requerido')
                .isLength({ min: 3, max: 90 }).withMessage('La capital debe tener entre 3 y 90 caracteres')
                .run(req),

            // Validación para área
            body('area')
                .isFloat({ gt: 0 }).withMessage('El campo "area" debe ser un número positivo.')
                .run(req),

            // Validación para población
            body('population')
                .isInt({ gt: 0 }).withMessage('El campo "población" debe ser un número entero positivo.')
                .run(req),


            // Validación para borders
            body('borders')
                .custom((value) => {
                    // Convierte el valor de 'borders' en un array si es un string
                    // Si 'value' es un array, no se hace nada, pero si es un string, lo divide por comas
                    const bordersArray = Array.isArray(value)
                        ? value
                        : typeof value === 'string'
                        ? value.split(',').map((b) => b.trim())
                        : [];

                    // Valida que no esté vacío
                    if (bordersArray.length === 0) {
                        throw new Error('El campo "borders" debe ser un array no vacío.');
                    }

                    // Valida que cada elemento sea una cadena de 3 letras MAYUSCULAS
                    for (const border of bordersArray) {
                        if (!/^[A-Z]{3}$/.test(border)) {
                            throw new Error('Cada elemento de borders debe ser una cadena de 3 letras mayúsculas.');
                        }
                    }

                    return true;
                })
                .run(req),
        ]);

        // Verifica los resultados de las validaciones
        const errors = validationResult(req); // Obtiene todos los errores de validación de la solicitud 'req'
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // Devuelve una respuesta con el código de estado 400 y los errores en formato JSON
        }
        
        // Si no hay errores, continúa con el siguiente middleware o controlador
        next();
    }


    export const preprocesarDatos = (req, res, next) => {
        if (req.body.borders && typeof req.body.borders === 'string') {
            // Transforma el string en un array, eliminando espacios adicionales
            req.body.borders = req.body.borders.split(',').map(border => border.trim());
        } else {
            // Si no existe el campo, lo inicializa como un array vacío
            req.body.borders = [];
        }

        
        next();
    };
    
