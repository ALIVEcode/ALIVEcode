import { LevelTableProps, StyledLevelTable } from './LevelTableTypes';

/**
 * This module defines all properties related to the data table in AI levels.
 * The structure of the table is described in this object while the style of
 * the table is set inLevelTableTypes.
 * @param props the props of the table :
 *     - data the data to insert in the table.
 *     - dataX the name of the X column of the table.
 *     - dataY the name of the Y column of the table.
 * @returns 
 */

const LevelTable = (props: LevelTableProps) => {
  let num: number = 0;
  function renderTableData() {
    
    return (
      <>
        {props.data.map((point: any, index: number) => {
          const {id, x, y} = point;
          num++;
          return (
            <tr key={id}>
              <td className="data-number">{num}</td>
              <td className="data">{x}</td>
              <td className="data">{y}</td>
            </tr>
          )
        })}
      </>
    )
  }

  return (
    <StyledLevelTable>
      <div className="container">
        <table className="table">
          <tbody className="body">
            <tr>
              <td className="titles"></td>
              <td className="titles">{props.xData}</td>
              <td className="titles">{props.yData}</td>
            </tr>
            {renderTableData()}
          </tbody>
        </table>
      </div>
    </StyledLevelTable>
  )
}

export default LevelTable;