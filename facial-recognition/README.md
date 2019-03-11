In order to run these a couple things need to be configured:

1. Add the subscription key to the code in the parts of the header of all these requests

2. make sure to create ./personIds/ directory

3. if you want to log a response use:

    print(response.status_code)
    print(response.text)