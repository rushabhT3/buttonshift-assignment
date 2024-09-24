# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import WorkBoard, Task
from .serializers import WorkBoardSerializer, TaskSerializer

class WorkBoardViewSet(viewsets.ModelViewSet):
    serializer_class = WorkBoardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkBoard.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def add_task(self, request, pk=None):
        work_board = self.get_object()
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(work_board=work_board)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'])
    def update_task(self, request, pk=None):
        task = Task.objects.get(id=request.data.get('id'))
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)