In order to run these a couple things need to be configured:

1. Add the subscription key at the top of the file.

2. There is a confidence interval at the top of the file, which can be tweaked. It represents the lowest level of confidence that will be accepted.

2. make sure to create ./personIds/ directory

3. if you want to log a response use:

    print(response.status_code)
    print(response.text)

4. Group (bus) names CANNOT be uppercase