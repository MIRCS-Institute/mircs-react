import { observer } from 'mobx-react'
import Layout from '../../utils/Layout'
import PropTypes from 'prop-types'
import React from 'react'
import RecordDeleteButton from './RecordDeleteButton'
import RecordEditButton from './RecordEditButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const RecordsTable = observer(class extends React.Component {
  static propTypes = {
    dataSetId: PropTypes.string.isRequired,
    records: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  }

  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            {this.props.fields.map((field) => (
              <TableCell key={field._id}>
                {field._id}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.records.map((record) => (
            <TableRow key={record._id}>
              {this.props.fields.map((field) => (
                <TableCell key={field._id}>
                  {record[field._id]}
                </TableCell>
              ))}
              <TableCell style={{ ...Layout.row }}>
                <RecordDeleteButton dataSetId={this.props.dataSetId} recordId={record._id}
                  onRefresh={this.props.onRefresh} onError={this.props.onError}/>
                <RecordEditButton dataSetId={this.props.dataSetId} record={record}
                  onRefresh={this.props.onRefresh}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
})

export default RecordsTable
