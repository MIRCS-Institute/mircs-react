import Environment from '../utils/environment'
import csv from 'csv'
import axios from 'axios'

const DEBUG = Environment.getRequired('DEBUG');

const csvConversion = {};

csvConversion.convertToJson = function (newDataSet) {
    uploadCSV(newDataSet);
};

let uploadCSV = uploadCSV = (newDataSet) => {
    const reader = new FileReader();
    reader.onload = () => {
        csv.parse(reader.result, (err, data) => {
            // figure out how this will take a name
            const fileData = {
                name: data[1][0],
                description: data[2][0],
                data: data
            };
            console.log(fileData);
            axios.post('/api/datasets', {
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
    reader.readAsBinaryString(newDataSet[0]);
}

export default csvConversion;