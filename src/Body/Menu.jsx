import PropTypes from 'prop-types'
export default function Menu({handleOptionChange}) {
  return (
    <div>
        <button onClick={() => handleOptionChange('start')}>start</button>
        <button onClick={() => handleOptionChange('finish')}>finish</button>
        <button onClick={() => handleOptionChange('wall')}>wall</button>
        <button onClick={() => handleOptionChange('empty')}>empty</button>
        {/* <button onClick={() => handleStart}>Start Algorithm</button> */}
        {/* <button onClick={handleRandomWalls}>
        Generate Maze
      </button> */}
    </div>
  )
}

Menu.propTypes = {
    handleOptionChange: PropTypes.func.isRequired,
    // handleRandomWalls: PropTypes.func.isRequired,
    // mazeGenerated: PropTypes.bool.isRequired
}