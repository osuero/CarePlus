using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using CarePlus.Application.DTOs.Consultations;
using CarePlus.Application.Interfaces.Repositories;
using CarePlus.Application.Models;
using CarePlus.Application.Services;
using CarePlus.Domain.Entities;
using CarePlus.Domain.Enums;
using CarePlus.Infrastructure.Persistence;
using CarePlus.Infrastructure.Repositories;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace CarePlus.Application.Tests;

public class ConsultationServiceTests
{
    private const string TenantId = "tenant-1";

    private static ApplicationDbContext BuildContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase($"Consultations-{Guid.NewGuid()}")
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task CreateAsync_ShouldFail_WhenPatientIsMissing()
    {
        await using var context = BuildContext();
        var consultationRepository = new ConsultationRepository(context);
        var patientRepository = Mock.Of<IPatientRepository>();
        var userRepository = Mock.Of<IUserRepository>();
        var service = new ConsultationService(consultationRepository, patientRepository, userRepository);

        var request = new CreateConsultationRequest
        {
            DoctorId = Guid.NewGuid(),
            ConsultationDateTime = DateTime.UtcNow,
            ReasonForVisit = "Checkup"
        };

        var result = await service.CreateAsync(TenantId, request, CancellationToken.None);

        result.IsSuccess.Should().BeFalse();
        result.ErrorCode.Should().Be("consultation.patient.required");
    }

    [Fact]
    public async Task CreateAsync_ShouldPersistConsultationWithSymptoms()
    {
        await using var context = BuildContext();

        var patient = new Patient
        {
            Id = Guid.NewGuid(),
            TenantId = TenantId,
            FirstName = "Jane",
            LastName = "Doe",
            Email = "jane@example.com",
            Gender = Gender.Female,
            DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-30))
        };

        var doctor = new User
        {
            Id = Guid.NewGuid(),
            TenantId = TenantId,
            FirstName = "John",
            LastName = "Smith",
            Email = "john@example.com",
            Gender = Gender.Male,
            DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-35))
        };

        context.Patients.Add(patient);
        context.Users.Add(doctor);
        await context.SaveChangesAsync();

        var consultationRepository = new ConsultationRepository(context);
        var patientRepository = new PatientRepository(context);
        var userRepository = new UserRepository(context);
        var service = new ConsultationService(consultationRepository, patientRepository, userRepository);

        var request = new CreateConsultationRequest
        {
            PatientId = patient.Id,
            DoctorId = doctor.Id,
            ConsultationDateTime = DateTime.UtcNow,
            ReasonForVisit = "Headache",
            Symptoms =
            [
                new SymptomEntryDto { Description = "Migraine", Severity = 3 },
                new SymptomEntryDto { Description = "Nausea" }
            ]
        };

        var result = await service.CreateAsync(TenantId, request, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value!.Symptoms.Should().HaveCount(2);
        result.Value.ReasonForVisit.Should().Be("Headache");
    }

    [Fact]
    public async Task UpdateAsync_ShouldReplaceSymptoms()
    {
        await using var context = BuildContext();

        var patient = new Patient
        {
            Id = Guid.NewGuid(),
            TenantId = TenantId,
            FirstName = "Mary",
            LastName = "Jones",
            Email = "mary@example.com",
            Gender = Gender.Female,
            DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-28))
        };

        var doctor = new User
        {
            Id = Guid.NewGuid(),
            TenantId = TenantId,
            FirstName = "Greg",
            LastName = "House",
            Email = "greg@example.com",
            Gender = Gender.Male,
            DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-45))
        };

        var consultation = new Consultation
        {
            Id = Guid.NewGuid(),
            TenantId = TenantId,
            PatientId = patient.Id,
            DoctorId = doctor.Id,
            ConsultationDateTime = DateTime.UtcNow,
            ReasonForVisit = "Old reason"
        };

        var symptom = new SymptomEntry
        {
            Id = Guid.NewGuid(),
            TenantId = TenantId,
            ConsultationId = consultation.Id,
            Description = "Old symptom"
        };

        context.Patients.Add(patient);
        context.Users.Add(doctor);
        context.Consultations.Add(consultation);
        context.SymptomEntries.Add(symptom);
        await context.SaveChangesAsync();

        var consultationRepository = new ConsultationRepository(context);
        var patientRepository = new PatientRepository(context);
        var userRepository = new UserRepository(context);
        var service = new ConsultationService(consultationRepository, patientRepository, userRepository);

        var request = new UpdateConsultationRequest
        {
            ReasonForVisit = "Updated reason",
            Symptoms = [new SymptomEntryDto { Description = "New" }]
        };

        var result = await service.UpdateAsync(TenantId, consultation.Id, request, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        var saved = await consultationRepository.GetByIdWithSymptomsAsync(TenantId, consultation.Id, CancellationToken.None);
        saved!.Symptoms.Should().ContainSingle(s => s.Description == "New");
        saved.Symptoms.Should().HaveCount(1);
    }

    [Fact]
    public async Task GetByPatientAsync_ShouldReturnDescendingConsultations()
    {
        await using var context = BuildContext();

        var patient = new Patient
        {
            Id = Guid.NewGuid(),
            TenantId = TenantId,
            FirstName = "Will",
            LastName = "Byers",
            Email = "will@example.com",
            Gender = Gender.Male,
            DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-18))
        };

        var doctor = new User
        {
            Id = Guid.NewGuid(),
            TenantId = TenantId,
            FirstName = "Eleven",
            LastName = "Hawkins",
            Email = "el@example.com",
            Gender = Gender.Female,
            DateOfBirth = DateOnly.FromDateTime(DateTime.UtcNow.AddYears(-20))
        };

        var olderConsultation = new Consultation
        {
            Id = Guid.NewGuid(),
            TenantId = TenantId,
            PatientId = patient.Id,
            DoctorId = doctor.Id,
            ConsultationDateTime = DateTime.UtcNow.AddDays(-5),
            ReasonForVisit = "Follow up"
        };

        var recentConsultation = new Consultation
        {
            Id = Guid.NewGuid(),
            TenantId = TenantId,
            PatientId = patient.Id,
            DoctorId = doctor.Id,
            ConsultationDateTime = DateTime.UtcNow,
            ReasonForVisit = "New issue"
        };

        context.Patients.Add(patient);
        context.Users.Add(doctor);
        context.Consultations.AddRange(olderConsultation, recentConsultation);
        await context.SaveChangesAsync();

        var consultationRepository = new ConsultationRepository(context);
        var queryService = new ConsultationQueryService(consultationRepository);

        var result = await queryService.GetByPatientAsync(TenantId, patient.Id, 1, 10, CancellationToken.None);

        result.Items.Should().HaveCount(2);
        result.Items.First().Id.Should().Be(recentConsultation.Id);
        result.TotalCount.Should().Be(2);
    }
}
