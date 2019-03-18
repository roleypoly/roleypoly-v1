import Error from '../_error'
export default ({ router: { query: { code = 404 } } }) => <Error statusCode={code} />
