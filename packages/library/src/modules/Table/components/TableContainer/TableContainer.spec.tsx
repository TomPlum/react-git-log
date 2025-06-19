import { render } from '@testing-library/react'
import { TableContainer } from 'modules/Table/components/TableContainer/TableContainer'

describe('Table Container', () => {
  it('should render a wrapping div element with the correct styles when a custom row is used', () => {
    const customRow = () => (
      <div>
        <p>Custom Row Contents</p>
      </div>
    )

    const { asFragment } = render(
      <TableContainer rowQuantity={5} row={customRow}>
        <div>
          Stubbed Table Contents
        </div>
      </TableContainer>
    )

    expect(asFragment()).toMatchSnapshot()
  })
})