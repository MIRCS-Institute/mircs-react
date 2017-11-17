import Environment from '../utils/environment'
import csv from 'csv'
import axios from 'axios'

const DEBUG = Environment.getRequired('DEBUG');

const csvConversion = {};

csvConversion.convertToJson = function (newCollection) {
    uploadCSV(newCollection);
};

let uploadCSV = uploadCSV = (newCollection) => {
    const reader = new FileReader();
    reader.onload = () => {
        csv.parse(reader.result, (err, data) => {
            // figure out how this will take a name
            const fileData = {
                name: data[1][0],
                rows: data.length
            };
            axios.post('/api/create-collection', {
                file: fileData
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        });
    };
    reader.readAsBinaryString(newCollection[0]);
}

export default csvConversion;