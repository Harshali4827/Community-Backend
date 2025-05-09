import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import amenityRoutes from './routes/amenityRoutes.js';
import amenityMasterRoutes from './routes/amenityMasterRoutes.js';
import applicationModuleRoutes from './routes/applicationModuleRoutes.js';
import propertyAssetsRoutes from './routes/propertyAssetsRoutes.js'
import sectorRoutes from './routes/sectorRoutes.js';
import blocksRoutes from './routes/blockRoutes.js';
import unitRoutes from './routes/unitRoutes.js';
import gateRoutes from './routes/gatesRoutes.js';
import bankRoutes from './routes/bankRoutes.js';
import officeRoutes from './routes/officesRoutes.js';
import csvRoutes from './routes/csvRoutes.js';
import usePropertyUnitRoutes from './routes/propertyUnitRoutes.js';
import userPropertyRoutes from './routes/userPropertyRoutes.js';
import userRoleRoutes from './routes/userRoleRoutes.js';
import addAllRoutes from './routes/addAllRoutes.js';
import getAllRoutes from './routes/getAllRoutes.js';
import childGroupRoutes from './routes/ledgerChildGroupRoutes.js';
import ledgerGroupRoutes from './routes/ledgerGroupRoutes.js';
import ledgerRoutes from './routes/ledgerRoutes.js';
import ledgerSubGroupRoutes from './routes/ledgerSubGroupRoutes.js';
dotenv.config();

const app = express();
app.use(cors({
    origin: ["https://dev-admin.communitybolt.com","https://dev.communitybolt.com","http://localhost:3000",'http://localhost:3001','http://localhost:3002','http://localhost:3003', "http://192.168.1.21:3001","http://192.168.1.21:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/api/uploads', express.static('uploads'));
app.use('/api', userRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/gates', gateRoutes);
app.use('/api/amenity', amenityRoutes);
app.use('/api/amenity-masters', amenityMasterRoutes);
app.use('/api/application-module', applicationModuleRoutes);
app.use('/api/property-assets', propertyAssetsRoutes);
app.use('/api/sectors', sectorRoutes);
app.use('/api/blocks', blocksRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/bank-details', bankRoutes);
app.use('/api/offices', officeRoutes);
app.use('/api/import-excel', csvRoutes);
app.use('/api/user-property-units', usePropertyUnitRoutes);
app.use('/api/users-property', userPropertyRoutes);
app.use('/api/users-role',userRoleRoutes);
app.use('/api/add-all', addAllRoutes);
app.use('/api', getAllRoutes);
app.use('/api/ledger-childgroup', childGroupRoutes);
app.use('/api/ledger-group', ledgerGroupRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/ledger-subgroup', ledgerSubGroupRoutes);
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
