import { CurrentDataSetFields } from '../../api/DataSetFields'
import { getCurrentDataSetId } from '../../api/DataSet'
import { observer } from 'mobx-react'
import Layout from '../../utils/Layout'
import PropTypes from 'prop-types'
import React from 'react'
import RecordDeleteButton from './RecordDeleteButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const ManageRecordsTable = observer(class extends React.Component {
  static propTypes = {
    records: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]).isRequired,
  }

  render() {
    const dataSetId = getCurrentDataSetId()
    const fields = CurrentDataSetFields.res.get('list', [])

    return (
      <Table>
        <TableHead>
          <TableRow>
            {fields.map((field) => (
              <TableCell key={field._id}>
                {field._id}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.records.map((record) => (
            <TableRow key={record._id}>
              {fields.map((field) => (
                <TableCell key={field._id}>
                  {record[field._id]}
                </TableCell>
              ))}
              <TableCell style={{ ...Layout.row }}>
                <RecordDeleteButton dataSetId={dataSetId} recordId={record._id}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
})

export default ManageRecordsTable
