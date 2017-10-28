
import React from 'react';

import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class SortIssues extends React.Component {
  constructor(props) {
    super(props);

    // states
    this.state = {
      select: [
        {
          name: 'Newest',
          order: 'CREATED_AT',
          direction: 'DESC'
        },
        {
          name: 'Oldest',
          order: 'CREATED_AT',
          direction: 'ASC'
        },
        {
          name: 'Most commented',
          order: 'COMMENTS',
          direction: 'DESC'
        },
        {
          name: 'Least Commented',
          order: 'COMMENTS',
          direction: 'ASC'
        },
        {
          name: 'Recently updated',
          order: 'UPDATED_AT',
          direction: 'DESC'
        },
        {
          name: 'Leasrt recently updated',
          order: 'UPDATED_AT',
          direction: 'ASC'
        }
      ]
    };
  }

  sort(index) {
    const selected = this.state.select[index];
    this.props.sort(selected.order, selected.direction);
  }

  render() {
    return (
      <FormGroup controlId="formControlsSelect">
        <ControlLabel>Sort</ControlLabel>
        <FormControl componentClass="select" placeholder="select" onChange={event => this.sort(event.target.value)}>
          { this.state.select.map( (item, index) => <option value={index} key={index}>{item.name}</option> ) }
        </FormControl>
      </FormGroup>
    );
  }
}

export default SortIssues;
