using CarePlus.Api.Common.ErrorHandling;
using CarePlus.Api.Endpoints;
using CarePlus.Api.GraphQL;
using CarePlus.Api.Infrastructure.Serialization;
using CarePlus.Api.Infrastructure.Tenancy;
using CarePlus.Application;
using CarePlus.Application.Interfaces;
using CarePlus.Infrastructure;
using CarePlus.Infrastructure.Persistence.SeedData;

const string FrontendCorsPolicy = "FrontendCorsPolicy";

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new DateOnlyJsonConverter());
    options.SerializerOptions.Converters.Add(new NullableDateOnlyJsonConverter());
});

builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddControllers();
var frontendOrigins = new[]
{
    "http://localhost:4200",
    "https://localhost:4200",
    "http://127.0.0.1:4200",
    "https://127.0.0.1:4200"
};

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        FrontendCorsPolicy,
        policy => policy
            .WithOrigins(frontendOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ITenantProvider, HttpContextTenantProvider>();
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services
    .AddGraphQLServer()
    .AddQueryType(d => d.Name("Query"))
    .AddTypeExtension<UserQueries>()
    .AddTypeExtension<RoleQueries>()
    .AddMutationType(d => d.Name("Mutation"))
    .AddTypeExtension<RoleMutations>();

var app = builder.Build();

app.UseExceptionHandler();

await DatabaseSeeder.SeedAsync(app.Services);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors(FrontendCorsPolicy);

app.MapControllers();
app.MapUserEndpoints();
app.MapGraphQL();

app.Run();
