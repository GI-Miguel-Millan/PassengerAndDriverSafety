import React, { Component } from 'react';
import SimpleTable from './components/SimpleTable';
import NavTabs from './components/tabs';
import FloatingActionButton from './components/ActionButton';
class App extends Component {
	  render() {
    return (
		<div>
			<NavTabs />
			<FloatingActionButton />
			<SimpleTable />
		</div>
    );
  }
}
export default App