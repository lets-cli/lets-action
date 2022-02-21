# lets-action
Github action to setup lets task runner

* [Usage](#usage)
  * [Workflow](#workflow)
* [Customizing](#customizing)
  * [inputs](#inputs)


## Usage

### Workflow

```yaml
name: lets

on:
  pull_request:
  push:

jobs:
  lets:
    runs-on: ubuntu-latest
    steps:
      -
        name: Checkout
        uses: actions/checkout@v2
      -
        name: Install Lets
        uses: lets/lets-action@v1
        with:
          version: latest
      -
        name: Run Lets
        run: lets --version
```

## Customizing

### inputs

Following inputs can be used as `step.with` keys

| Name             | Type    | Default      | Description                                                      |
|------------------|---------|--------------|------------------------------------------------------------------|

| `version`**¹**   | String  | `latest`     | Lets version                                               |
                          |
