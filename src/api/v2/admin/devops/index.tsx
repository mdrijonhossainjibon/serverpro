import { Router } from "express";
import { NOSQL } from "Database";
import { sendJSONResponse } from "responseHandler";

export const devopsRouter = Router();

devopsRouter.get('/', async (req, res, next) => {
    try {
        const allPermission = (await NOSQL.Permission.find())
        sendJSONResponse({ res, result: allPermission });
    } catch (error) {
        next(error);
    }
});

devopsRouter.post('/', async (req, res, next) => {
    try {
        const { action, verb, url, role } = req.body;
 

        // Validate that required fields are provided
        if (!action || !verb || !url || !role) {
           return sendJSONResponse({ res , statusCode : 400,  message : { error : 'Missing required fields.'} , description :  'All required fields (action, verb, url, role) must be provided. Please include all the necessary fields and try again'})
        }

        // Additional validation checks can be added here
        // For example, ensure that 'action', 'verb', 'url', and 'role' have acceptable values or formats

        // Check if a permission with the same properties already exists
        const existingPermission = await NOSQL.Permission.findOne({ action, verb, url, role });

        if (existingPermission) {
            return sendJSONResponse({ res , statusCode : 409 , message: { error : "A permission with the same action, verb, URL, and role already exists. Please modify the existing permission or use different parameters."  , code : -10003 }  });  
        } 

        // Attempt to create the new permission
        const result = await NOSQL.Permission.create({ action, verb, url, role });
       return sendJSONResponse({ res, result });

    } catch (error : any) {
        // Check for specific error types (e.g., database connection issues, validation errors)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Invalid data provided.", details: error.errors });
        } else if (error.name === 'MongoError' && error.code === 11000) {
            // Handle duplicate key error
            return res.status(409).json({ message: "Duplicate entry detected.", details: error.keyValue });
        } else {
            return res.status(500).json({ message: "An internal server error occurred.", error: error.message });
        }

       return next(error); // Pass the error to the next middleware if needed
    }
});


 
devopsRouter.put('/:id', async (req, res, next) => {
    try {
        const { action, verb, url, role } = req.body;
 
         const { id } = req.params;

        // Validate that required fields are provided
        if (!action || !verb || !url || !role) {
           return sendJSONResponse({ res , statusCode : 400,  message : { error : 'Missing required fields.'} , description :  'All required fields (action, verb, url, role) must be provided. Please include all the necessary fields and try again'})
        }

        // Additional validation checks can be added here
        // For example, ensure that 'action', 'verb', 'url', and 'role' have acceptable values or formats

        // Check if a permission with the same properties already exists
        const existingPermission = await NOSQL.Permission.findOne({ _id : id  });

        if (!existingPermission) {
            return sendJSONResponse({ res , statusCode : 409 , message: { error : "A permission with the same action, verb, URL, and role already exists. Please modify the existing permission or use different parameters."  , code : -10003 }  });  
        } 
 
        const result = await NOSQL.Permission.findByIdAndUpdate( id,   { action, verb, url, role }, { new: true, runValidators: true } );
          return sendJSONResponse({ res, result });

    } catch (error : any) {
        // Check for specific error types (e.g., database connection issues, validation errors)
        if (error.name === 'ValidationError') {
           return sendJSONResponse({ res , statusCode : 408,  message : { error : 'Invalid data provided.' } , details : { reason :  error.message }})
           
        } 
        if (error.name === 'MongoError' && error.code === 11000) {
            return sendJSONResponse({ res , statusCode : 409,  message : { error : 'Duplicate entry detected' } , details : { reason :  error.keyValue }})
             
        }  

       return next(error); // Pass the error to the next middleware if needed
    }
});





devopsRouter.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if the permission with the given ID exists
        const existingPermission = await NOSQL.Permission.findById(id);

        if (!existingPermission) {
            return sendJSONResponse({
                res,
                statusCode: 404,
                message: {
                    error: "Permission not found.",
                    code: -10004
                }
            });
        }

        // Delete the found permission
        const result = await NOSQL.Permission.findByIdAndDelete(id);

        // Check if the deletion was successful
        if (!result) {
            return sendJSONResponse({
                res,
                statusCode: 500,
                message: {
                    error: "Failed to delete the permission.",
                    code: -10005
                }
            });
        }

        return sendJSONResponse({ res, result });

    } catch (error: any) {
        // Handle validation errors or other known issues
        if (error.name === 'ValidationError') {
            return sendJSONResponse({
                res,
                statusCode: 400,
                message: {
                    error: 'Invalid data provided.',
                    code: -10006
                },
                details: { reason: error.message }
            });
        }

        return next(error); // Pass the error to the next middleware
    }
});
