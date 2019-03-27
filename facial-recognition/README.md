In order to run these a couple things need to be configured:

1. Add the subscription key to the code in the parts of the header of all these requests

    - the functions file only has it in one spot at the top!

2. There is a confidence interval at the top of the functions file, which can be tweaked. It represents the lowest level of confidence that will be accepted.

2. make sure to create ./personIds/ directory

3. if you want to log a response use:

    print(response.status_code)
    print(response.text)