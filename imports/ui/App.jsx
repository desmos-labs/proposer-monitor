import React from 'react';

import { useTracker } from 'meteor/react-meteor-data'
import { Validators } from '../api/validators/validators'
import { Blocks } from '../api/blocks/blocks'

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import moment from 'moment';
import numbro from 'numbro';


const useValidators = () => useTracker(() => {
  // The publication must also be secure
  const subscription = Meteor.subscribe('validators')
  const validators = Validators.find().fetch();
  return {
    validators,
    isLoading: !subscription.ready()
  }
}, [])

const useLatestBlock = () => useTracker(() => {
  // The publication must also be secure
  const subscription = Meteor.subscribe('blocks.latest')
  const block = Blocks.findOne()
  return {
    block,
    isBlocksLoading: !subscription.ready()
  }
}, [])

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export const App = () => {
    const { isLoading, validators } = useValidators()
    const { isBlocksLoading, block } = useLatestBlock()

    const classes = useStyles();

    return <div>
        <CssBaseline />
        <Container>
          <h1>Random Proposer Test</h1>
          {(!isBlocksLoading)?<div>
            <h4>Latest Block</h4>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Latest Height</TableCell>
                      <TableCell align="right">Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">{block.height}</TableCell>
                      <TableCell align="right">{moment.utc(block.block.header.time).fromNow()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
          </div>:''}
          {(!isLoading)?<div>
            <h4>Validators</h4>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Validator</TableCell>
                    <TableCell align="right">Address</TableCell>
                    <TableCell align="right">Power</TableCell>
                    <TableCell align="right">Proposer Count</TableCell>
                    <TableCell align="right">Count %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {validators.map((validator, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">{validator.name}</TableCell>
                      <TableCell align="right">{validator.address}</TableCell>
                      <TableCell align="right">{validator.power}</TableCell>
                      <TableCell align="right">{validator.proposer_count}</TableCell>
                      <TableCell align="right">{(block && block.height)?numbro(validator.proposer_count/block.height).format({output: "percent",mantissa: 4}):''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>:''}
        </Container>
    </div>
}
