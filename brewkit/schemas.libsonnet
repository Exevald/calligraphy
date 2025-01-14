local images = import 'images.libsonnet';

local copy = std.native('copy');
local copyFrom = std.native('copyFrom');

{
    generateOPENApi(openAPIs): {
        local oapicodegenCommand(file) =
            'oapi-codegen -alias-types -generate types,client,chi-server,strict-server,spec ' + file + ' > ' + file + '.gen.go',
        local mappedFiles = [copy(openAPI, openAPI) for openAPI in openAPIs],
        local generateCommands = [oapicodegenCommand(openAPI) for openAPI in openAPIs],

        from: images.gobuilder,
        workdir: "/app",
        copy: mappedFiles + [
            // Image with oapi-codegen based on scratch, so there is no shell. Copy into builder image
            copyFrom(
                images.oapicodegen,
                "/usr/bin/oapi-codegen",
                "/usr/bin/oapi-codegen"
            )
        ],
        command: std.join(' && ', generateCommands),
        output: {
            artifact: "/app/api",
            "local": "./api"
        },
    },
}