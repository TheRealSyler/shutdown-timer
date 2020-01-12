import React from 'react';
import * as renderer from 'react-test-renderer';

import Home from '../../src/renderer/views/home/Home';

describe('Home View', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
