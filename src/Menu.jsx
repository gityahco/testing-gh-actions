import PropTypes from 'prop-types'
export default function Menu({handleOptionChange}) {
  return (
    <div>
        <button onClick={() => handleOptionChange('start')}>start</button>
        <button onClick={() => handleOptionChange('finish')}>finish</button>
        <button onClick={() => handleOptionChange('wall')}>wall</button>
    </div>
  )
}

Menu.propTypes = {
    handleOptionChange: PropTypes.func.isRequired
}