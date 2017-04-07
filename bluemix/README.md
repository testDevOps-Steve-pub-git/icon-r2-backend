### Deployment guide for Bluemix

- Install cloud foundry command line interface from https://github.com/cloudfoundry/cli/releases


- Set the Cloud Foundry to point to Bluemix
   #### ``` cf api https://api.ng.bluemix.net ```


- Login to the Bluemix. Replace the username, organization and space value
   #### ``` cf login -u ravi.chaudhary@mohawkcollege.ca -o "ICON R2" -s dev ```

   Options available for space in `Mohawk Bluemix account`: -
   - `dev`
   - `staging`


- Push to Bluemix. Replace the manifest depending upon the environment
   #### ``` cf push -f ./dev-manifest.yml ```

   Options available for manifest: -
   - `dev-manifest.yml`
   - `stg-manifest.yml`
